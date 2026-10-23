window.VOL = window.VOL || {};
(function (V) {
  'use strict';

  V.viewers = [];
  V.disposeViewers = function () { V.viewers.forEach(v => v.dispose()); V.viewers = []; };

  const DIR0 = new THREE.Vector3(1.15, 0.9, 1.65).normalize();
  const INK = 0x1b2238, UNK = 0xff7a3d;

  function shade(hex, k) {
    const c = new THREE.Color(hex), hsl = {};
    c.getHSL(hsl);
    c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + k)));
    return c;
  }

  // Les línies WebGL sempre fan 1 px: els traços gruixuts es fan amb cilindres instanciats
  const UP = new THREE.Vector3(0, 1, 0);
  function tubes(pairs, r, mat, joints) {
    const g = new THREE.Group();
    if (!pairs.length) return g;
    const mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 8, 1, true), mat, pairs.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), d = new THREE.Vector3(), mid = new THREE.Vector3(), sc = new THREE.Vector3();
    pairs.forEach(([a, b], i) => {
      d.subVectors(b, a);
      const len = d.length() || 1e-6;
      q.setFromUnitVectors(UP, d.divideScalar(len));
      mid.addVectors(a, b).multiplyScalar(0.5);
      m4.compose(mid, q, sc.set(r, len, r));
      mesh.setMatrixAt(i, m4);
    });
    mesh.frustumCulled = false;
    mesh.renderOrder = mat.depthTest === false ? 25 : 4;
    g.add(mesh);
    if (joints) {
      const seen = new Map();
      pairs.forEach(pr => pr.forEach(p => { const k = p.toArray().map(v => v.toFixed(3)).join(); if (!seen.has(k)) seen.set(k, p); }));
      const js = new THREE.InstancedMesh(new THREE.SphereGeometry(r, 8, 6), mat, seen.size);
      let i = 0;
      seen.forEach(p => { js.setMatrixAt(i++, m4.makeTranslation(p.x, p.y, p.z)); });
      js.frustumCulled = false; js.renderOrder = mesh.renderOrder;
      g.add(js);
    }
    return g;
  }

  // Arestes d'una geometria com a traços gruixuts
  function thickEdges(geom, color, r, angle) {
    const pos = new THREE.EdgesGeometry(geom, angle || 28).attributes.position, pairs = [];
    for (let i = 0; i < pos.count; i += 2) pairs.push([new THREE.Vector3().fromBufferAttribute(pos, i), new THREE.Vector3().fromBufferAttribute(pos, i + 1)]);
    return tubes(pairs, r, new THREE.MeshBasicMaterial({ color }), true);
  }

  // Ombra suau sota el cos
  let shadowCanvas = null;
  function shadowTexture() {
    if (!shadowCanvas) {
      shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = shadowCanvas.height = 128;
      const ctx = shadowCanvas.getContext('2d'), gr = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(27,34,56,0.30)'); gr.addColorStop(0.55, 'rgba(27,34,56,0.14)'); gr.addColorStop(1, 'rgba(27,34,56,0)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(shadowCanvas);
  }

  function makeLabel(text, opts) {
    opts = opts || {};
    const fs = 40, padX = 16, padY = 10;
    const font = `700 ${fs}px "Atkinson Hyperlegible", system-ui, sans-serif`;
    const c = document.createElement('canvas');
    let ctx = c.getContext('2d');
    ctx.font = font;
    const w = Math.ceil(ctx.measureText(text).width) + padX * 2, h = fs + padY * 2;
    c.width = w * 2; c.height = h * 2;
    ctx = c.getContext('2d');
    ctx.scale(2, 2);
    const r = h / 2;
    ctx.beginPath();
    ctx.moveTo(r, 1); ctx.lineTo(w - r, 1); ctx.arc(w - r, r, r - 1, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(r, h - 1); ctx.arc(r, r, r - 1, Math.PI / 2, Math.PI * 1.5); ctx.closePath();
    ctx.fillStyle = opts.bg || 'rgba(255,255,255,0.95)';
    ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = opts.border || 'rgba(27,34,56,0.25)'; ctx.stroke();
    ctx.font = font; ctx.fillStyle = opts.color || '#1b2238';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2 + 2);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true, sizeAttenuation: false }));
    s.renderOrder = 30;
    s.userData.aspect = w / h;
    return s;
  }

  class Viewer {
    constructor(el, opts) {
      this.el = el;
      this.opts = opts || {};
      const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      r.localClippingEnabled = true;
      r.domElement.setAttribute('aria-label', this.opts.label || 'Figura 3D. Arrossega per girar-la.');
      r.domElement.setAttribute('role', 'img');
      el.appendChild(r.domElement);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 2000);
      const ctl = this.controls = new THREE.OrbitControls(this.camera, r.domElement);
      ctl.enableDamping = true; ctl.dampingFactor = 0.08; ctl.enablePan = false;
      ctl.maxPolarAngle = Math.PI * 0.53;
      ctl.autoRotate = !!this.opts.autoRotate; ctl.autoRotateSpeed = 1.1;

      // Llum moderada: la cara de dalt no s'ha de cremar ni canviar de to
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8f98ae, 0.7));
      const sun = new THREE.DirectionalLight(0xffffff, 0.5);
      sun.position.set(5, 7, 8);
      this.scene.add(sun);
      const fill = new THREE.DirectionalLight(0xffffff, 0.28);
      fill.position.set(-6, 3, -4);
      this.scene.add(fill);

      this.root = new THREE.Group();
      this.scene.add(this.root);
      this.items = []; this.extras = []; this.labels = [];
      this.grid = null; this.lastR = 0; this.fitted = false;
      this.tickers = new Set();

      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(el);
      this.resize();
      this.alive = true;
      const loop = t => {
        if (!this.alive) return;
        this.raf = requestAnimationFrame(loop);
        if (!this.el.isConnected || this.el.offsetParent === null) return;
        this.tickers.forEach(fn => fn(t));
        if (this.opts.sway) { this.root.rotation.y = Math.sin(t / 2600) * this.opts.sway; if (this.grid) this.grid.rotation.y = this.root.rotation.y; }
        this.controls.update();
        this.placeLabels();
        r.render(this.scene, this.camera);
      };
      this.raf = requestAnimationFrame(loop);
      V.viewers.push(this);
    }

    resize() {
      const w = this.el.clientWidth, h = this.el.clientHeight;
      if (!w || !h) return;
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.scaleLabels();
    }

    placeLabels() {
      const v = this._pv || (this._pv = new THREE.Vector3()), w = this._pw || (this._pw = new THREE.Vector3());
      const W = this.el.clientWidth, H = this.el.clientHeight, px = this.opts.labelPx || 30, boxes = [];
      this.labels.forEach(s => {
        const u = s.userData;
        s.getWorldPosition(v).project(this.camera);
        let cx = 0.5;
        if (u.side) {
          u.group.localToWorld(w.copy(u.ref)).project(this.camera);
          cx = v.x >= w.x ? -0.08 : 1.08;
        }
        // Si toca una etiqueta ja col·locada, s'aparta en vertical
        const sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * H, bw = u.aspect * px;
        const r = { l: sx - cx * bw, r: sx + (1 - cx) * bw, t: sy - px / 2, b: sy + px / 2 };
        for (let k = 0; k < 3; k++) {
          const o = boxes.find(q => r.l < q.r + 3 && r.r > q.l - 3 && r.t < q.b + 3 && r.b > q.t - 3);
          if (!o) break;
          const dy = sy >= (o.t + o.b) / 2 ? o.b + 3 - r.t : o.t - 3 - r.b;
          r.t += dy; r.b += dy;
        }
        boxes.push(r);
        s.center.set(cx, 1 - (sy - r.t) / px);
      });
    }

    // Etiquetes d'alçada fixa en píxels, sigui quina sigui la mida del visor
    scaleLabels() {
      const h = this.el.clientHeight;
      if (!h || !this.labels) return;
      const px = this.opts.labelPx || 30;
      const L = px * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * 2 / h;
      this.labels.forEach(s => s.scale.set(s.userData.aspect * L, L, 1));
    }

    clear() {
      const disp = o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
      };
      this.root.traverse(disp);
      this.root.clear();
      this.items = []; this.extras = []; this.labels = [];
    }

    setScene(solids, opts) {
      this.clear();
      solids.forEach(spec => this.items.push(this.buildSolid(spec)));
      this.finish((opts && opts.fit) || 'auto');
    }

    buildSolid(spec) {
      const S = V.SHAPES[spec.shape], p = spec.p;
      const g = new THREE.Group();
      const H = S.H(p);
      g.position.set(spec.x || 0, (spec.y || 0) + (spec.flip ? H : 0), spec.z || 0);
      if (spec.flip) g.rotation.x = Math.PI;
      if (spec.rot) g.rotation.set(spec.rot[0], spec.rot[1], spec.rot[2]);
      this.root.add(g);
      const color = spec.color || S.color;
      const item = { spec, S, group: g, H, baseY: spec.y || 0 };
      const geom = S.build(p);
      geom.computeBoundingBox();
      const bb = geom.boundingBox;
      const size = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z);
      item.size = size;

      if (spec.cubes && S.cubes) {
        const [nx, nz, ny] = S.cubes(p);
        const total = nx * ny * nz;
        const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.93, 0.93, 0.93), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), total);
        const m4 = new THREE.Matrix4(), base = new THREE.Color(color), col = new THREE.Color();
        let i = 0;
        for (let y = 0; y < ny; y++) for (let z = 0; z < nz; z++) for (let x = 0; x < nx; x++) {
          m4.makeTranslation(x - nx / 2 + 0.5, y + 0.5, z - nz / 2 + 0.5);
          mesh.setMatrixAt(i, m4);
          col.copy(base).offsetHSL(0, 0, y % 2 ? 0.1 : -0.02);
          mesh.setColorAt(i, col);
          i++;
        }
        g.add(mesh);
        item.cubeMesh = mesh; item.cubeTotal = total;
        // L'enquadrament es calcula amb la caixa exterior (un InstancedMesh només informa d'un cub)
        const box = new THREE.LineSegments(new THREE.EdgesGeometry(geom), new THREE.LineBasicMaterial({ color: shade(color, -0.3), transparent: true, opacity: 0.5 }));
        box.userData.solid = true;
        g.add(box, thickEdges(geom, shade(color, -0.32), size * 0.005));
        geom.dispose();
      } else {
        const water = !!spec.water;
        const op = spec.opacity != null ? spec.opacity : (water ? 0.2 : 0.92);
        const mat = new THREE.MeshStandardMaterial({
          color, roughness: 0.5, metalness: 0.04, transparent: op < 1, opacity: op,
          side: THREE.DoubleSide, depthWrite: op >= 0.85,
          polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.renderOrder = op < 0.85 ? 3 : 0;
        mesh.userData.solid = true;
        g.add(mesh);
        item.mesh = mesh;
        g.add(thickEdges(geom, shade(color, -0.3), size * 0.0065));

        if (water) {
          const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
          const wmesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({
            color: 0x38bdf8, transparent: true, opacity: 0.55, roughness: 0.2, side: THREE.DoubleSide, clippingPlanes: [plane], depthWrite: false
          }));
          wmesh.scale.set(0.985, 0.995, 0.985);
          wmesh.renderOrder = 1;
          const capGeom = new THREE.ShapeGeometry(S.baseShape(p), 48);
          capGeom.rotateX(-Math.PI / 2);
          const cap = new THREE.Mesh(capGeom, new THREE.MeshStandardMaterial({ color: 0xbfe9ff, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
          cap.renderOrder = 2;
          g.add(wmesh, cap);
          item.water = { plane, wmesh, cap };
        }
      }

      if (spec.dims && S.dims) {
        const m = size * 0.11;
        const hide = spec.hideDims || [];
        S.dims(p, { m, diam: spec.diam }).filter(d => !hide.includes(d.sym)).forEach(d => {
          const a = new THREE.Vector3(...d.a), b = new THREE.Vector3(...d.b);
          const unk = spec.unknown === d.sym;
          const col = unk ? UNK : INK;
          const mat = () => new THREE.MeshBasicMaterial({ color: col, depthTest: false, transparent: true });
          const len = a.distanceTo(b), dir = b.clone().sub(a).normalize();
          // Fletxes als extrems; el traç s'escurça perquè no sobresurti de la punta
          const ah = Math.min(size * 0.06, len * 0.3), ar = size * 0.024;
          const a2 = a.clone().addScaledVector(dir, ah * 0.9), b2 = b.clone().addScaledVector(dir, -ah * 0.9);
          let pairs = [[a2, b2]];
          if (d.dashed) {
            pairs = [];
            const dash = size * 0.05, gap = size * 0.032, L = a2.distanceTo(b2);
            for (let s = 0; s < L; s += dash + gap) pairs.push([a2.clone().addScaledVector(dir, s), a2.clone().addScaledVector(dir, Math.min(s + dash, L))]);
          }
          g.add(tubes(pairs, size * 0.0085, mat()));
          [[b, dir], [a, dir.clone().negate()]].forEach(([tip, v]) => {
            const cone = new THREE.Mesh(new THREE.ConeGeometry(ar, ah, 14), mat());
            cone.quaternion.setFromUnitVectors(UP, v);
            cone.position.copy(tip).addScaledVector(v, -ah / 2);
            cone.renderOrder = 25;
            g.add(cone);
          });
          const txt = unk ? `${d.sym} = ?` : `${d.sym} = ${V.fmt(d.val)}${spec.unit ? ' ' + spec.unit : ''}`;
          const vc = V.VARC[d.sym];
          const lab = makeLabel(txt, unk ? { bg: '#ff7a3d', color: '#fff', border: '#ff7a3d' } : vc ? { bg: vc, color: '#fff', border: vc } : null);
          lab.position.copy(a).add(b).multiplyScalar(0.5);
          // Les cotes verticals porten l'etiqueta al costat (cap enfora del cos), no a sobre del traç
          if (Math.abs(dir.y) > 0.85) Object.assign(lab.userData, { side: true, group: g, ref: bb.getCenter(new THREE.Vector3()) });
          g.add(lab);
          this.labels.push(lab);
        });
      }

      if (!spec.rot && spec.shadow !== false) {
        const w = (bb.max.x - bb.min.x) * 1.5 + size * 0.25, dz = (bb.max.z - bb.min.z) * 1.5 + size * 0.25;
        const sh = new THREE.Mesh(new THREE.PlaneGeometry(w, dz), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
        sh.rotation.x = -Math.PI / 2;
        const cz = (bb.min.z + bb.max.z) / 2;
        sh.position.set((spec.x || 0) + (bb.min.x + bb.max.x) / 2, (spec.y || 0) + 0.004, (spec.z || 0) + (spec.flip ? -cz : cz));
        sh.renderOrder = -1;
        this.root.add(sh);
      }
      return item;
    }

    add(obj) {
      obj.userData.solid = true;
      this.root.add(obj);
      this.extras.push(obj);
      return obj;
    }

    finish(fit) {
      const box = new THREE.Box3();
      this.root.updateMatrixWorld(true);
      this.root.traverse(o => { if (o.userData.solid) box.expandByObject(o); });
      if (box.isEmpty()) return;
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const R = Math.max(sphere.radius, 0.5);
      this.scaleLabels();

      if (this.grid) { this.scene.remove(this.grid); this.grid.geometry.dispose(); this.grid.material.dispose(); this.grid = null; }
      if (this.opts.grid !== false) {
        const ext = Math.max(box.max.x - box.min.x, box.max.z - box.min.z);
        let size = Math.ceil(ext * 1.7 + 2);
        if (size % 2) size++;
        const div = size <= 40 ? size : 20;
        const grid = new THREE.GridHelper(size, div, 0xa9b2c6, 0xd6dce7);
        grid.position.set(Math.round(sphere.center.x), box.min.y - 0.003, Math.round(sphere.center.z));
        this.scene.add(grid);
        this.grid = grid;
      }

      const need = fit === 'always' || !this.fitted || (fit === 'auto' && (R > this.lastR * 1.04 || R < this.lastR * 0.4));
      if (need) {
        const dir = this.fitted ? this.camera.position.clone().sub(this.controls.target).normalize() : (this.opts.dir ? new THREE.Vector3(...this.opts.dir).normalize() : DIR0.clone());
        let dist = R / Math.sin(THREE.MathUtils.degToRad(this.camera.fov / 2)) * (this.opts.zoom || 1.25);
        if (this.camera.aspect < 1) dist /= Math.max(0.55, this.camera.aspect);
        this.controls.target.copy(sphere.center);
        this.camera.position.copy(sphere.center).addScaledVector(dir, dist);
        this.camera.near = dist / 100; this.camera.far = dist * 20;
        this.camera.updateProjectionMatrix();
        this.lastR = R; this.fitted = true;
      } else if (fit !== 'never') {
        const delta = sphere.center.clone().sub(this.controls.target);
        this.controls.target.add(delta);
        this.camera.position.add(delta);
      }
    }

    // Omple d'aigua fins a una fracció de l'altura (en coordenades del món)
    setFill(i, frac) {
      const it = this.items[i];
      if (!it || !it.water) return;
      frac = Math.max(0, Math.min(1, frac));
      it.fill = frac;
      const hw = frac * it.H, w = it.water;
      const on = hw > it.H * 0.003;
      w.wmesh.visible = on; w.cap.visible = on;
      w.plane.constant = it.baseY + hw;
      const hl = it.spec.flip ? it.H - hw : hw;
      const k = it.S.scaleAt(it.spec.p, Math.min(Math.max(hl, 0), it.H * 0.999));
      w.cap.scale.set(k * 0.985, 1, k * 0.985);
      w.cap.position.y = hl;
      if (k < 0.002) w.cap.visible = false;
    }

    setCubes(i, n) {
      const it = this.items[i];
      if (it && it.cubeMesh) it.cubeMesh.count = Math.max(0, Math.min(it.cubeTotal, n));
    }

    dispose() {
      this.alive = false;
      cancelAnimationFrame(this.raf);
      this.ro.disconnect();
      this.clear();
      this.controls.dispose();
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement.remove();
    }
  }

  V.Viewer = Viewer;
  V.shade = shade;
  V.thickEdges = thickEdges;
})(window.VOL);
