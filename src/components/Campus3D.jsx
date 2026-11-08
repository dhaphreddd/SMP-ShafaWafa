import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move3d, Sun, Moon, Compass, RotateCw } from 'lucide-react';

export default function Campus3D() {
  const hostRef = useRef(null);
  const controlsRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState('day'); // 'day' | 'night'

  useEffect(() => {
    let cancelled = false;
    let renderer;
    let controls;
    let visibilityObserver;
    let animationId = null;
    let canvasVisible = !('IntersectionObserver' in window);
    let resizeObserver;
    let THREE;
    let scene;
    const host = hostRef.current;
    if (!host) return undefined;

    const init = async () => {
      try {
        THREE = await import('three');
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        if (cancelled || !host) return;

        scene = new THREE.Scene();
        const dayBg = new THREE.Color('#f4f3ec');
        const nightBg = new THREE.Color('#06110e');
        scene.background = dayBg;
        const fog = new THREE.Fog('#f4f3ec', 26, 52);
        scene.fog = fog;

        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
        camera.position.set(16, 12, 17);
        camera.lookAt(-0.5, 1.8, 1.0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(host.clientWidth || 800, host.clientHeight || 480);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.18;
        renderer.shadowMap.enabled = false;
        renderer.domElement.setAttribute(
          'aria-label',
          'Model 3D arsitektural gedung sekolah SMP Shafa Wafa sesuai berkas masterplan PONDOK TUBAN N2. Gunakan sentuhan atau tetikus untuk memutar dan memperbesar model.'
        );
        host.appendChild(renderer.domElement);

        // Lighting setup
        const hemiLight = new THREE.HemisphereLight(0xfff7e8, 0x5a6857, 2.2);
        scene.add(hemiLight);

        const sun = new THREE.DirectionalLight(0xffecd0, 2.4);
        sun.position.set(12, 18, 10);
        scene.add(sun);

        const fill = new THREE.DirectionalLight(0xbdd6ea, 1.1);
        fill.position.set(-14, 12, -10);
        scene.add(fill);

        // Warm plaza lights
        const plazaLight = new THREE.PointLight(0xffbe6b, 0, 18);
        plazaLight.position.set(-1, 3.2, 2.5);
        scene.add(plazaLight);

        const archLight = new THREE.PointLight(0xffd17a, 0, 10);
        archLight.position.set(1.4, 2.5, 7.2);
        scene.add(archLight);

        // Helper materials
        const mat = (color, roughness = 0.8) => new THREE.MeshStandardMaterial({ color, roughness });
        const groundMat = mat('#4d6b42', 0.95); // lush green lawn
        const roadMat = mat('#282b2d', 0.9);   // asphalt
        const roadLineMat = mat('#e8e8e8', 0.7);
        const curbMat = mat('#7d807b', 0.85);
        const plazaMat = mat('#c7c4ba', 0.82); // stone paving
        const plazaAccentMat = mat('#948f83', 0.82);

        // Architectural materials matching PONDOK TUBAN N2.pdf:
        const stoneBaseMat = mat('#2c3135', 0.88);   // dark andesite river stone ground floor
        const stonePillarMat = mat('#393f44', 0.85); // stone pilasters
        const stoneTrimMat = mat('#525a60', 0.8);
        const woodDarkMat = mat('#3b2011', 0.72);    // rich Javanese teakwood framework
        const woodEaveMat = mat('#2f190c', 0.75);    // deep timber eaves and brackets
        const panelCreamMat = mat('#e8dfcb', 0.85);  // carved cream relief floral panels
        const panelBorderMat = mat('#4e2b16', 0.7);  // timber border for relief panels
        const portalStoneMat = mat('#ded1b0', 0.75); // cream sandstone for Grand Islamic Arch
        const portalAccentMat = new THREE.MeshStandardMaterial({
          color: '#c99d45',
          metalness: 0.45,
          roughness: 0.45,
        }); // brass / gold Islamic mashrabiya lattice
        const roofTileMat = mat('#b04a23', 0.74);    // terracotta clay tile
        const roofRidgeMat = mat('#752c13', 0.65);   // terracotta glazed ridge cap
        const roofTrimGold = mat('#d9a52b', 0.5);    // corner bubungan gold tip
        const domeWhiteMat = mat('#fbfcfd', 0.35);   // white marble dome on portal
        const finialGoldMat = new THREE.MeshStandardMaterial({
          color: '#e5b338',
          metalness: 0.7,
          roughness: 0.25,
        }); // golden crescent finial
        const glassLitMat = new THREE.MeshStandardMaterial({
          color: '#4a6b73',
          emissive: new THREE.Color('#000000'),
          emissiveIntensity: 0,
          roughness: 0.3,
          metalness: 0.15,
        });
        const lanternMat = new THREE.MeshStandardMaterial({
          color: '#fff3c4',
          emissive: new THREE.Color('#ffa726'),
          emissiveIntensity: 0.6,
          roughness: 0.3,
        });
        const ironFenceMat = mat('#1c1e20', 0.7);

        const box = (parent, x, y, z, w, h, d, material) => {
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
          mesh.position.set(x, y, z);
          parent.add(mesh);
          return mesh;
        };

        // 1. Site ground & roadways
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(38, 32), groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.16;
        scene.add(ground);

        // Asphalt road on front & right
        box(scene, 0, -0.07, 12.2, 34, 0.14, 4.8, roadMat);
        box(scene, 13.5, -0.07, 1.2, 4.8, 0.14, 26, roadMat);
        // Road dashed center line
        for (let rx = -15; rx <= 15; rx += 3.2) {
          box(scene, rx, 0.015, 12.2, 1.6, 0.02, 0.18, roadLineMat);
        }
        for (let rz = -9; rz <= 12; rz += 3.2) {
          box(scene, 13.5, 0.015, rz, 0.18, 0.02, 1.6, roadLineMat);
        }

        // Road curbs
        box(scene, -0.2, 0.04, 9.75, 33, 0.18, 0.22, curbMat);
        box(scene, 11.0, 0.04, 0.5, 0.22, 0.18, 18.5, curbMat);

        // 2. Central Courtyard / Plaza (matching Masterplan & PDF)
        // Main paving bed
        box(scene, -1.8, 0.02, 2.6, 22.5, 0.08, 14.0, plazaMat);
        // Courtyard decorative border inlays
        box(scene, -1.8, 0.025, 2.6, 21.0, 0.085, 12.6, plazaAccentMat);
        box(scene, -1.8, 0.03, 2.6, 19.6, 0.09, 11.2, plazaMat);

        // Raised flowerbeds with shrubs in courtyard perimeter
        box(scene, -10.5, 0.14, 6.6, 3.2, 0.24, 4.2, curbMat);
        box(scene, -10.5, 0.24, 6.6, 2.9, 0.1, 3.9, groundMat);
        box(scene, 7.8, 0.14, 6.6, 4.0, 0.24, 4.2, curbMat);
        box(scene, 7.8, 0.24, 6.6, 3.7, 0.1, 3.9, groundMat);

        // 3. Authentic Indonesian Limasan / Tajug Multi-Tier Roof Generator
        function createHipRoofGeometry(w, d, h, overhang = 0.35) {
          const geom = new THREE.BufferGeometry();
          const W = w + 2 * overhang;
          const D = d + 2 * overhang;
          const p0 = [-W / 2, 0, -D / 2];
          const p1 = [W / 2, 0, -D / 2];
          const p2 = [W / 2, 0, D / 2];
          const p3 = [-W / 2, 0, D / 2];
          let r0, r1;
          let positions = [];
          if (W >= D) {
            const R = Math.max(0.12, W - D);
            r0 = [-R / 2, h, 0];
            r1 = [R / 2, h, 0];
            positions = [
              ...p3, ...p2, ...r1, ...p3, ...r1, ...r0,
              ...p1, ...p0, ...r0, ...p1, ...r0, ...r1,
              ...p0, ...p3, ...r0,
              ...p2, ...p1, ...r1,
            ];
          } else {
            const R = Math.max(0.12, D - W);
            r0 = [0, h, -R / 2];
            r1 = [0, h, R / 2];
            positions = [
              ...p0, ...p1, ...r0, ...p1, ...r1, ...r0,
              ...p2, ...p3, ...r1, ...p3, ...r0, ...r1,
              ...p3, ...p0, ...r0,
              ...p1, ...p2, ...r1,
            ];
          }
          geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
          geom.computeVertexNormals();
          return geom;
        }

        function addMultiTierJavaneseRoof(parent, cx, baseY, cz, w, d, totalH = 1.65) {
          const roofGroup = new THREE.Group();
          roofGroup.position.set(cx, baseY, cz);
          parent.add(roofGroup);

          // Tier 1: Lower flared eave skirt
          const skirtH = totalH * 0.44;
          const skirtGeom = createHipRoofGeometry(w, d, skirtH, 0.45);
          const skirtMesh = new THREE.Mesh(skirtGeom, roofTileMat);
          skirtMesh.material.side = THREE.DoubleSide;
          roofGroup.add(skirtMesh);

          // Eave timber trim band
          box(roofGroup, 0, -0.04, 0, w + 0.95, 0.08, d + 0.95, woodEaveMat);

          // Middle clerestory / ventilation band
          const bandH = 0.22;
          const bandW = w * 0.78;
          const bandD = d * 0.78;
          box(roofGroup, 0, skirtH + bandH / 2, 0, bandW, bandH, bandD, woodDarkMat);

          // Tier 2: Upper steeper hipped roof
          const upperH = totalH * 0.56;
          const upperGeom = createHipRoofGeometry(bandW, bandD, upperH, 0.22);
          const upperMesh = new THREE.Mesh(upperGeom, roofTileMat);
          upperMesh.position.y = skirtH + bandH;
          upperMesh.material.side = THREE.DoubleSide;
          roofGroup.add(upperMesh);

          // Ridge cap (bubungan jurai)
          const ridgeY = skirtH + bandH + upperH;
          const isWide = w >= d;
          const ridgeLen = isWide ? Math.max(0.2, bandW - bandD + 0.3) : Math.max(0.2, bandD - bandW + 0.3);
          if (isWide) {
            box(roofGroup, 0, ridgeY + 0.05, 0, ridgeLen, 0.1, 0.18, roofRidgeMat);
            // Curved bubungan corner tips (khas Nusantara)
            box(roofGroup, -ridgeLen / 2 - 0.08, ridgeY + 0.1, 0, 0.14, 0.18, 0.14, roofTrimGold);
            box(roofGroup, ridgeLen / 2 + 0.08, ridgeY + 0.1, 0, 0.14, 0.18, 0.14, roofTrimGold);
          } else {
            box(roofGroup, 0, ridgeY + 0.05, 0, 0.18, 0.1, ridgeLen, roofRidgeMat);
            box(roofGroup, 0, ridgeY + 0.1, -ridgeLen / 2 - 0.08, 0.14, 0.18, 0.14, roofTrimGold);
            box(roofGroup, 0, ridgeY + 0.1, ridgeLen / 2 + 0.08, 0.14, 0.18, 0.14, roofTrimGold);
          }
          return roofGroup;
        }

        // 4. Facade Builder for 3-Story Pesantren Buildings (PONDOK TUBAN N2 design)
        // - Floor 1: Dark andesite stone base with pillars & wall sconces
        // - Floor 2 & 3: Teak wood frame, 3-pane mullioned windows, carved cream relief panels
        function addPesantrenWing({ cx, cz, width, depth, orientation = 'horizontal' }) {
          const wing = new THREE.Group();
          wing.position.set(cx, 0, cz);
          scene.add(wing);

          const floorH = 1.25;
          const totalFloors = 3;
          const isH = orientation === 'horizontal';

          // Foundation plinth
          box(wing, 0, 0.18, 0, width + 0.3, 0.36, depth + 0.3, stoneTrimMat);

          // Floor 1 (Lantai 1): Batu andesit alam hitam-abu
          box(wing, 0, 0.36 + floorH / 2, 0, width, floorH, depth, stoneBaseMat);

          // Floor 1 Pilasters & wall sconces
          const bays = isH ? Math.max(4, Math.floor(width / 1.5)) : Math.max(3, Math.floor(depth / 1.5));
          for (let i = 0; i <= bays; i++) {
            const frac = i / bays;
            const px = isH ? -width / 2 + frac * width : 0;
            const pz = isH ? (depth / 2 + 0.08) : -depth / 2 + frac * depth;
            // Stone pilaster
            box(wing, isH ? px : width / 2 + 0.08, 0.36 + floorH / 2, isH ? pz : pz, 0.28, floorH + 0.04, 0.28, stonePillarMat);
            // Sconce lamp on outer face
            box(wing, isH ? px : width / 2 + 0.24, 0.36 + floorH * 0.62, isH ? depth / 2 + 0.24 : pz, 0.09, 0.15, 0.09, lanternMat);
          }

          // Ground floor windows / doors
          for (let i = 0; i < bays; i++) {
            const frac = (i + 0.5) / bays;
            const wx = isH ? -width / 2 + frac * width : width / 2 + 0.02;
            const wz = isH ? depth / 2 + 0.02 : -depth / 2 + frac * depth;
            box(wing, wx, 0.36 + floorH * 0.5, wz, isH ? 0.72 : 0.04, floorH * 0.58, isH ? 0.04 : 0.72, glassLitMat);
          }

          // Intermediate floor beams (timber)
          box(wing, 0, 0.36 + floorH, 0, width + 0.18, 0.14, depth + 0.18, woodDarkMat);

          // Floors 2 & 3 (Lantai 2 & 3): Kayu jati gelap + jendela 3-daun + panel relief ukir krem
          for (let f = 1; f < totalFloors; f++) {
            const baseY = 0.36 + f * floorH;

            // Main wall mass
            box(wing, 0, baseY + floorH / 2, 0, width, floorH, depth, woodDarkMat);

            // Rafter / eave brackets under windows
            box(wing, 0, baseY + 0.06, depth / 2 + 0.1, width + 0.2, 0.08, 0.14, woodEaveMat);

            for (let i = 0; i < bays; i++) {
              const frac = (i + 0.5) / bays;
              const bx = isH ? -width / 2 + frac * width : width / 2 + 0.06;
              const bz = isH ? depth / 2 + 0.06 : -depth / 2 + frac * depth;
              const bayW = isH ? (width / bays) * 0.82 : 0.05;
              const bayD = isH ? 0.05 : (depth / bays) * 0.82;

              // Alternating rhythm: 3-pane window OR carved cream panel (from PDF page 7-9 & 22-24)
              if (i % 2 === 0) {
                // 3-pane traditional vertical window with timber mullions
                box(wing, bx, baseY + floorH * 0.54, bz, isH ? bayW : 0.04, floorH * 0.62, isH ? 0.04 : bayD, glassLitMat);
                // Timber frame surround
                box(wing, bx, baseY + floorH * 0.54, bz + (isH ? 0.02 : 0), isH ? bayW + 0.06 : 0.06, floorH * 0.68, isH ? 0.02 : bayD + 0.06, woodDarkMat);
                // 2 vertical timber mullions dividing into 3 panes
                if (isH) {
                  box(wing, bx - bayW * 0.22, baseY + floorH * 0.54, bz + 0.025, 0.035, floorH * 0.62, 0.03, woodDarkMat);
                  box(wing, bx + bayW * 0.22, baseY + floorH * 0.54, bz + 0.025, 0.035, floorH * 0.62, 0.03, woodDarkMat);
                } else {
                  box(wing, bx + 0.025, baseY + floorH * 0.54, bz - bayD * 0.22, 0.03, floorH * 0.62, 0.035, woodDarkMat);
                  box(wing, bx + 0.025, baseY + floorH * 0.54, bz + bayD * 0.22, 0.03, floorH * 0.62, 0.035, woodDarkMat);
                }
              } else {
                // Ornate cream carved arabesque relief panel
                box(wing, bx, baseY + floorH * 0.52, bz, isH ? bayW * 0.88 : 0.04, floorH * 0.56, isH ? 0.04 : bayD * 0.88, panelCreamMat);
                box(wing, bx, baseY + floorH * 0.52, bz + (isH ? 0.02 : 0), isH ? bayW : 0.06, floorH * 0.64, isH ? 0.02 : bayD, panelBorderMat);
              }
            }

            // Beam separator between floor 2 & 3
            box(wing, 0, baseY + floorH, 0, width + 0.24, 0.12, depth + 0.24, woodDarkMat);
          }

          // Top frieze under roof eave
          const roofBaseY = 0.36 + totalFloors * floorH;
          box(wing, 0, roofBaseY + 0.08, 0, width + 0.45, 0.16, depth + 0.45, woodEaveMat);

          // Authentic 2-tier Limasan / Tajug roof
          addMultiTierJavaneseRoof(wing, 0, roofBaseY + 0.16, 0, width, depth, 1.85);

          return wing;
        }

        // BUILD THE COMPLEX (Accurately arranged matching PONDOK TUBAN N2.pdf and Masterplan.jpeg):
        // Main Wing (Sayap Kiri/Utara): 14.2m x 3.8m, 3 Lantai
        addPesantrenWing({ cx: -4.2, cz: -3.4, width: 14.2, depth: 3.8, orientation: 'horizontal' });

        // Side Wing (Sayap Kanan/Timur): 3.8m x 10.4m, 3 Lantai (meets Main Wing in L-junction)
        addPesantrenWing({ cx: 2.2, cz: 1.8, width: 3.8, depth: 10.4, orientation: 'vertical' });

        // 5. Lobby / Entrance Pavilion on Main Wing (Signboard "SHAFA WAFA")
        const lobbyGroup = new THREE.Group();
        lobbyGroup.position.set(-4.8, 0, -1.2);
        scene.add(lobbyGroup);
        // Steps & floor
        box(lobbyGroup, 0, 0.14, 0, 3.4, 0.28, 1.8, stoneTrimMat);
        // Stone pillars
        for (const px of [-1.45, 1.45]) {
          box(lobbyGroup, px, 0.95, 0.72, 0.24, 1.4, 0.24, woodDarkMat);
          box(lobbyGroup, px, 1.7, 0.72, 0.1, 0.15, 0.1, lanternMat);
        }
        // Signboard with "SMP SHAFA WAFA"
        box(lobbyGroup, 0, 1.9, 0.76, 2.7, 0.52, 0.1, woodDarkMat);
        box(lobbyGroup, 0, 1.9, 0.82, 2.5, 0.38, 0.04, portalAccentMat);
        // Tajug roof over lobby
        addMultiTierJavaneseRoof(lobbyGroup, 0, 2.18, 0, 3.4, 2.0, 1.1);

        // 6. THE GRAND ISLAMIC ARCH PORTAL (Portal Gerbang Megah - Bintang Desain PDF)
        // Located prominently on the front of the Side Wing (facing courtyard / street at x = 2.2, z = 7.3)
        function createPointedArchPortalShape(w, h, archW, springH, peakH) {
          const shape = new THREE.Shape();
          shape.moveTo(-w / 2, 0);
          shape.lineTo(w / 2, 0);
          shape.lineTo(w / 2, h);
          shape.lineTo(-w / 2, h);
          shape.closePath();

          const hole = new THREE.Path();
          hole.moveTo(-archW, 0);
          hole.lineTo(-archW, springH);
          hole.bezierCurveTo(-archW * 0.95, springH + (peakH - springH) * 0.65, -archW * 0.1, peakH - 0.05, 0, peakH);
          hole.bezierCurveTo(archW * 0.1, peakH - 0.05, archW * 0.95, springH + (peakH - springH) * 0.65, archW, springH);
          hole.lineTo(archW, 0);
          hole.closePath();
          shape.holes.push(hole);
          return shape;
        }

        const portalGroup = new THREE.Group();
        portalGroup.position.set(2.2, 0, 7.3);
        scene.add(portalGroup);

        const portalW = 3.8;
        const portalH = 4.4;
        const archW = 1.05;
        const springH = 2.1;
        const peakH = 3.55;

        // Sandstone portal plinth
        box(portalGroup, 0, 0.18, 0, portalW + 0.4, 0.36, 1.6, stoneTrimMat);

        // Extruded sandstone pointed arch portal
        const archShape = createPointedArchPortalShape(portalW, portalH, archW, springH, peakH);
        const archGeom = new THREE.ExtrudeGeometry(archShape, {
          depth: 1.0,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.05,
          bevelSegments: 3,
        });
        const archMesh = new THREE.Mesh(archGeom, portalStoneMat);
        archMesh.position.set(0, 0.36, -0.5);
        portalGroup.add(archMesh);

        // Islamic mashrabiya geometric latticework screen in upper arch
        const latticeGeom = new THREE.PlaneGeometry(archW * 1.8, (peakH - springH) * 1.1);
        const latticeMesh = new THREE.Mesh(latticeGeom, portalAccentMat);
        latticeMesh.position.set(0, 0.36 + springH + (peakH - springH) * 0.45, 0.01);
        portalGroup.add(latticeMesh);

        // Arch sconce lanterns
        box(portalGroup, -archW - 0.35, 2.2, 0.54, 0.12, 0.22, 0.12, lanternMat);
        box(portalGroup, archW + 0.35, 2.2, 0.54, 0.12, 0.22, 0.12, lanternMat);

        // Sandstone stepped cornice moulding above arch
        box(portalGroup, 0, 0.36 + portalH + 0.08, 0, portalW + 0.3, 0.16, 1.3, portalStoneMat);
        box(portalGroup, 0, 0.36 + portalH + 0.2, 0, portalW + 0.5, 0.12, 1.45, stoneTrimMat);

        // Two-tier pavilion terracotta roof above portal
        addMultiTierJavaneseRoof(portalGroup, 0, 0.36 + portalH + 0.26, 0, portalW + 0.2, 1.2, 1.35);

        // ICONIC WHITE DOME with GOLD CRESCENT FINIAL (kubah putih di atas portal arch, persis render PDF)
        const domeRoofY = 0.36 + portalH + 0.26 + 1.35;
        // White dome base ring
        box(portalGroup, 0, domeRoofY + 0.06, 0, 0.92, 0.12, 0.92, portalStoneMat);
        // White dome sphere
        const domeGeom = new THREE.SphereGeometry(0.42, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const domeMesh = new THREE.Mesh(domeGeom, domeWhiteMat);
        domeMesh.position.set(0, domeRoofY + 0.12, 0);
        portalGroup.add(domeMesh);
        // Golden spire & crescent finial
        const spireGeom = new THREE.CylinderGeometry(0.025, 0.045, 0.32, 8);
        const spireMesh = new THREE.Mesh(spireGeom, finialGoldMat);
        spireMesh.position.set(0, domeRoofY + 0.65, 0);
        portalGroup.add(spireMesh);
        const crescentGeom = new THREE.TorusGeometry(0.085, 0.02, 8, 16, Math.PI * 1.5);
        const crescentMesh = new THREE.Mesh(crescentGeom, finialGoldMat);
        crescentMesh.position.set(0, domeRoofY + 0.84, 0);
        crescentMesh.rotation.z = Math.PI * 0.25;
        portalGroup.add(crescentMesh);

        // 7. Perimeter Fence & Grand Front Entrance Gate (from Masterplan wireframe)
        const fenceY = 0.45;
        // Stone fence pillars along front street (z = 9.4)
        for (let fx = -12.5; fx <= 10.5; fx += 2.2) {
          // Leave entrance opening at fx between -2.5 and 0.5
          if (fx >= -2.6 && fx <= 0.6) continue;
          // Stone pillar
          box(scene, fx, fenceY, 9.4, 0.34, 0.9, 0.34, stoneBaseMat);
          box(scene, fx, fenceY + 0.48, 9.4, 0.4, 0.08, 0.4, stoneTrimMat);
          // Small glowing lantern on pillar cap
          box(scene, fx, fenceY + 0.58, 9.4, 0.1, 0.12, 0.1, lanternMat);
          // Wrought iron vertical railings between pillars
          if (fx + 2.2 <= 10.6 && !(fx >= -4.5 && fx <= 0.4)) {
            box(scene, fx + 1.1, fenceY - 0.05, 9.4, 1.85, 0.7, 0.04, ironFenceMat);
          }
        }

        // Left boundary fence
        for (let fz = -7.5; fz <= 9.4; fz += 2.4) {
          box(scene, -12.5, fenceY, fz, 0.34, 0.9, 0.34, stoneBaseMat);
          box(scene, -12.5, fenceY + 0.48, fz, 0.4, 0.08, 0.4, stoneTrimMat);
          if (fz + 2.4 <= 9.4) {
            box(scene, -12.5, fenceY - 0.05, fz + 1.2, 0.04, 0.7, 2.05, ironFenceMat);
          }
        }

        // Courtyard ornamental lamp posts
        const lampSpots = [
          [-2.2, 3.8], [-6.4, 4.5], [6.2, 4.2], [-7.5, 0.5],
        ];
        lampSpots.forEach(([lx, lz]) => {
          box(scene, lx, 0.9, lz, 0.09, 1.8, 0.09, woodDarkMat);
          box(scene, lx, 1.88, lz, 0.22, 0.26, 0.22, lanternMat);
          box(scene, lx, 2.05, lz, 0.28, 0.08, 0.28, roofRidgeMat);
        });

        // 8. Tropical Landscape Trees (frangipani, ketapang kencana, and palms)
        const trunkMat = mat('#583d28');
        const canopyMats = [mat('#4c6c39'), mat('#5d8047'), mat('#3d5930')];
        const treeSpots = [
          [-10.8, -6.5], [-8.4, -6.8], [-2.0, -6.8], [4.5, -6.8], [8.8, -6.5],
          [-11.2, -1.5], [-11.2, 2.5], [-10.5, 6.8],
          [6.8, -2.8], [6.8, 0.5], [8.2, 6.5], [10.2, 2.5],
          [-4.5, 8.5], [5.2, 8.5],
        ];
        treeSpots.forEach(([tx, tz], i) => {
          const tH = 0.85 + (i % 3) * 0.18;
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, tH, 7), trunkMat);
          trunk.position.set(tx, tH / 2, tz);
          scene.add(trunk);

          // Tiered canopy representing Ketapang Kencana / Frangipani
          for (let tier = 0; tier < 2; tier++) {
            const rad = 0.55 - tier * 0.12;
            const canopy = new THREE.Mesh(
              new THREE.ConeGeometry(rad, 0.45, 7),
              canopyMats[(i + tier) % canopyMats.length]
            );
            canopy.position.set(tx, tH + 0.18 + tier * 0.28, tz);
            scene.add(canopy);
          }
        });

        // Setup OrbitControls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.target.set(-0.5, 1.8, 1.0);
        controls.minDistance = 9;
        controls.maxDistance = 38;
        controls.maxPolarAngle = Math.PI * 0.48;

        const updateLighting = (targetMode) => {
          if (targetMode === 'night') {
            scene.background = nightBg;
            fog.color = nightBg;
            hemiLight.color.set(0x1a2e26);
            hemiLight.groundColor.set(0x060f0c);
            hemiLight.intensity = 0.9;
            sun.color.set(0x6ca3c9);
            sun.intensity = 1.0;
            fill.intensity = 0.35;
            plazaLight.intensity = 5.2;
            archLight.intensity = 4.2;
            glassLitMat.emissive.set(0xf6a623);
            glassLitMat.emissiveIntensity = 1.15;
            lanternMat.emissiveIntensity = 2.4;
          } else {
            scene.background = dayBg;
            fog.color = dayBg;
            hemiLight.color.set(0xfff7e8);
            hemiLight.groundColor.set(0x5a6857);
            hemiLight.intensity = 2.2;
            sun.color.set(0xffecd0);
            sun.intensity = 2.4;
            fill.intensity = 1.1;
            plazaLight.intensity = 0;
            archLight.intensity = 0;
            glassLitMat.emissive.set(0x000000);
            glassLitMat.emissiveIntensity = 0;
            lanternMat.emissiveIntensity = 0.6;
          }
        };

        controlsRef.current = {
          camera,
          controls,
          scene,
          updateLighting,
          rotate: (deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = camera.position.x - controls.target.x;
            const z = camera.position.z - controls.target.z;
            camera.position.x = controls.target.x + x * Math.cos(rad) - z * Math.sin(rad);
            camera.position.z = controls.target.z + x * Math.sin(rad) + z * Math.cos(rad);
            controls.update();
          },
          adjustZoom: (factor) => {
            const dir = camera.position.clone().sub(controls.target);
            dir.multiplyScalar(factor);
            camera.position.copy(controls.target.clone().add(dir));
            controls.update();
          },
          reset: () => {
            camera.position.set(16, 12, 17);
            controls.target.set(-0.5, 1.8, 1.0);
            controls.update();
          },
        };

        const resize = () => {
          if (!host || !renderer) return;
          const width = Math.max(host.clientWidth, 1);
          const height = Math.max(host.clientHeight, 1);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        const render = () => {
          if (cancelled || !canvasVisible) {
            animationId = null;
            return;
          }
          controls?.update();
          renderer?.render(scene, camera);
          animationId = requestAnimationFrame(render);
        };

        const startRendering = () => {
          if (!cancelled && canvasVisible && animationId === null) render();
        };

        if ('IntersectionObserver' in window) {
          canvasVisible = false;
          visibilityObserver = new IntersectionObserver(
            (entries) => {
              canvasVisible = Boolean(entries[0]?.isIntersecting);
              if (canvasVisible) startRendering();
              else if (animationId !== null) {
                cancelAnimationFrame(animationId);
                animationId = null;
              }
            },
            { rootMargin: '120px 0px' }
          );
          visibilityObserver.observe(host);
        } else {
          startRendering();
        }

        setReady(true);
      } catch (err) {
        console.error('Gagal menyiapkan model 3D:', err);
        if (!cancelled) setError(true);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (animationId !== null) cancelAnimationFrame(animationId);
      visibilityObserver?.disconnect();
      resizeObserver?.disconnect();
      controls?.dispose();
      controlsRef.current = null;
      if (scene) {
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
      }
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      }
    };
  }, []);

  const setLightingMode = (newMode) => {
    setMode(newMode);
    controlsRef.current?.updateLighting(newMode);
  };

  return (
    <div className="campus-3d-component">
      <div className="campus-canvas" ref={hostRef}>
        {!ready && !error && (
          <div className="campus-loading">
            <span className="spinner" />
            <span>Menyiapkan visualisasi 3D arsitektural Shafa Wafa...</span>
          </div>
        )}
        {error && (
          <div className="campus-error">
            <Move3d size={28} />
            <strong>Visualisasi 3D belum dapat dimuat.</strong>
            <span>Pastikan akselerasi WebGL aktif di browser Anda.</span>
          </div>
        )}
      </div>

      {ready && (
        <>
          {/* Top HUD Controller Bar matching Stitch */}
          <div className="campus-hud-top">
            <div className="hud-badge">
              <Compass size={16} />
              <span>3D Masterplan Interaktif (Pondok Tuban N2)</span>
            </div>
            <div className="hud-actions" aria-label="Kontrol kamera 3D">
              <button
                onClick={() => controlsRef.current?.adjustZoom(0.82)}
                title="Perbesar model"
                aria-label="Perbesar"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => controlsRef.current?.adjustZoom(1.22)}
                title="Perkecil model"
                aria-label="Perkecil"
              >
                <ZoomOut size={18} />
              </button>
              <div className="hud-divider" />
              <button
                onClick={() => controlsRef.current?.rotate(15)}
                title="Putar sudut pandang"
                aria-label="Putar"
              >
                <RotateCw size={18} />
              </button>
              <button
                onClick={() => controlsRef.current?.reset()}
                title="Atur ulang posisi kamera"
                aria-label="Atur ulang"
              >
                <RotateCcw size={17} />
              </button>
            </div>
          </div>

          {/* Bottom HUD Bar: Mode Day/Night & Legend */}
          <div className="campus-hud-bottom">
            <div className="hud-mode-toggle">
              <span className="hud-mode-label">Mode Visual:</span>
              <button
                className={`hud-mode-btn ${mode === 'day' ? 'is-active' : ''}`}
                onClick={() => setLightingMode('day')}
              >
                <Sun size={14} />
                <span>Siang (Fotorealistis)</span>
              </button>
              <button
                className={`hud-mode-btn ${mode === 'night' ? 'is-active' : ''}`}
                onClick={() => setLightingMode('night')}
              >
                <Moon size={14} />
                <span>Malam (Wireframe Glow)</span>
              </button>
            </div>

            <div className="model-legend">
              <span><i className="legend-school" />Gedung Utama 3 Lantai</span>
              <span><i className="legend-dorm" />Portal Gerbang Kubah</span>
              <span><i className="legend-open" />Pelataran & Lanskap</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
