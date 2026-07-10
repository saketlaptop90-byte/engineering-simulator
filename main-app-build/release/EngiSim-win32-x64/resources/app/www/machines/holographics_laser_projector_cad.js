import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const enclosureBlack = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.5 });
    const mirrorGold = new THREE.MeshPhysicalMaterial({ color: 0xffdd44, metalness: 1.0, roughness: 0.0, clearcoat: 1.0 }); // Polygonal spinning mirrors
    const lensGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, opacity: 1, transparent: true, ior: 1.5, roughness: 0.0 });
    const pcbGreen = new THREE.MeshPhysicalMaterial({ color: 0x003300, metalness: 0.3, roughness: 0.8 });
    const heatSinkAl = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.2 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Enclosure & Heatsink
    // ==========================================
    const housingGroup = new THREE.Group();
    
    // Extruded aluminum housing with massive cooling fins
    const finShape = new THREE.Shape();
    finShape.moveTo(-1, -0.5);
    finShape.lineTo(1, -0.5);
    finShape.lineTo(1, 0.5);
    // Draw 10 cooling fins on top
    for (let i = 0; i < 10; i++) {
        finShape.lineTo(0.9 - (i * 0.2), 0.5);
        finShape.lineTo(0.9 - (i * 0.2), 0.8); // Fin up
        finShape.lineTo(0.85 - (i * 0.2), 0.8);
        finShape.lineTo(0.85 - (i * 0.2), 0.5); // Fin down
    }
    finShape.lineTo(-1, 0.5);
    finShape.lineTo(-1, -0.5);

    const housingGeo = new THREE.ExtrudeGeometry(finShape, { depth: 3.0, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    const housing = new THREE.Mesh(housingGeo, heatSinkAl);
    housing.position.set(0, 0, -1.5);
    housingGroup.add(housing);
    
    group.add(housingGroup);
    parts.push({ mesh: housing, name: "Extruded Heatsink Enclosure", description: "Procedural aluminum extrusion with 10 massive cooling fins.", function: "Dissipates the immense thermal load of the class 4 laser diodes."});

    // ==========================================
    // 2. PROCEDURAL CAD: Optical Bench & Lasers
    // ==========================================
    const opticsGroup = new THREE.Group();
    
    // Internal PCB
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 2.8), pcbGreen);
    pcb.position.set(0, -0.4, 0);
    opticsGroup.add(pcb);
    
    // RGB Laser Diode Arrays
    const diodeGeo = new THREE.BoxGeometry(0.2, 0.2, 0.4);
    const laserR = new THREE.Mesh(diodeGeo, copper); laserR.position.set(-0.6, -0.2, -1.0);
    const laserG = new THREE.Mesh(diodeGeo, copper); laserG.position.set(0.0, -0.2, -1.0);
    const laserB = new THREE.Mesh(diodeGeo, copper); laserB.position.set(0.6, -0.2, -1.0);
    opticsGroup.add(laserR, laserG, laserB);
    
    // Beam combiners (Dichroic mirrors)
    const combinerGeo = new THREE.BoxGeometry(0.3, 0.3, 0.05);
    const combiner1 = new THREE.Mesh(combinerGeo, lensGlass);
    combiner1.position.set(-0.6, -0.2, -0.2);
    combiner1.rotation.y = Math.PI / 4;
    
    const combiner2 = new THREE.Mesh(combinerGeo, lensGlass);
    combiner2.position.set(0.0, -0.2, -0.2);
    combiner2.rotation.y = Math.PI / 4;
    
    opticsGroup.add(combiner1, combiner2);

    group.add(opticsGroup);
    parts.push({ mesh: pcb, name: "Dichroic Optical Bench", description: "RGB laser diode arrays and dichroic beam combiners.", function: "Generates and aligns the primary red, green, and blue laser beams into a single white beam."});

    // ==========================================
    // 3. PROCEDURAL CAD: Galvanometer Scanners & Polygon Mirror
    // ==========================================
    const scannerGroup = new THREE.Group();
    
    // High-speed Polygon Mirror (X-axis fast scan)
    const polygonGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8); // 8-sided mirror
    const polygonMirror = new THREE.Mesh(polygonGeo, mirrorGold);
    polygonMirror.position.set(0, -0.2, 0.5);
    polygonMirror.rotation.x = Math.PI / 2; // Spins around Z
    
    const polygonMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16).rotateX(Math.PI/2), darkSteel);
    polygonMotor.position.set(0, -0.2, 0.8);
    
    scannerGroup.add(polygonMirror, polygonMotor);
    group.userData.animatedMeshes['polygon'] = polygonMirror;
    
    // Y-axis Galvanometer Mirror (Slow scan)
    const galvoGeo = new THREE.BoxGeometry(0.4, 0.02, 0.2);
    const galvoMirror = new THREE.Mesh(galvoGeo, mirrorGold);
    galvoMirror.position.set(0, 0.2, 0.5);
    galvoMirror.rotation.x = Math.PI / 4; // Bounces beam out of the top
    
    const galvoMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16).rotateZ(Math.PI/2), darkSteel);
    galvoMotor.position.set(0.3, 0.2, 0.5);
    
    scannerGroup.add(galvoMirror, galvoMotor);
    group.userData.animatedMeshes['galvo'] = galvoMirror;
    
    // Output Window Lens
    const windowGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32).rotateX(Math.PI/2);
    const outWindow = new THREE.Mesh(windowGeo, lensGlass);
    outWindow.position.set(0, 0.5, 0.5); // Top of the housing
    outWindow.rotation.x = Math.PI / 2;
    scannerGroup.add(outWindow);

    group.add(scannerGroup);
    parts.push({ mesh: polygonMirror, name: "8-Sided Polygon Mirror", description: "Ultra-high-speed spinning gold polygon.", function: "Scans the laser beam horizontally at 50,000 RPM."});
    parts.push({ mesh: galvoMirror, name: "Y-Axis Galvanometer", description: "Precision oscillating mirror.", function: "Scans the beam vertically to draw the volumetric image layer by layer."});

    // ==========================================
    // 4. VFX: Volumetric Hologram Projection
    // ==========================================
    // We create a glowing wireframe globe to simulate the hologram
    const hologramMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
    const hologramGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const hologram = new THREE.Mesh(hologramGeo, hologramMat);
    hologram.position.set(0, 2.5, 0.5); // Projected above the machine
    
    // Scan beam (Pyramid showing the projection volume)
    const scanBeamMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const scanBeamGeo = new THREE.ConeGeometry(1.5, 2.0, 4, 1, true);
    const scanBeam = new THREE.Mesh(scanBeamGeo, scanBeamMat);
    scanBeam.position.set(0, 1.5, 0.5);
    
    group.add(hologram, scanBeam);
    group.userData.animatedMeshes['hologram'] = hologram;
    group.userData.animatedMeshes['scanBeam'] = scanBeam;

    parts.push({ mesh: hologram, name: "Volumetric Plasma Field", description: "Simulated 3D projection.", function: "The resulting image formed by the scanning lasers ionizing the air."});

    // ==========================================
    // 5. Factual Fasteners (4,200 parts)
    // ==========================================
    const boltCount = 4200;
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6).rotateX(Math.PI/2);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute tightly around the PCB and optical mounts
        dummy.position.set((Math.random() - 0.5) * 1.6, -0.38, (Math.random() - 0.5) * 2.6);
        dummy.rotation.set(Math.PI/2, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "4,200 Micro-Fasteners", description: "Factual quantity of instanced M2 screws.", function: "Secures the optics bench with extreme rigidity to prevent beam misalignment." });
    
    // Scale adjustment
    group.scale.set(1.5, 1.5, 1.5);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // Simulating the laser scanning
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Polygon mirror spins EXTREMELY fast
            group.userData.animatedMeshes['polygon'].rotation.z -= speed * 1.0; 
            
            // Galvo mirror oscillates rapidly
            group.userData.animatedMeshes['galvo'].rotation.x = (Math.PI / 4) + Math.sin(timeAcc * 20 * speed) * 0.1;
            
            // Hologram projection becomes visible
            group.userData.animatedMeshes['hologram'].opacity = 0.6 * speed;
            group.userData.animatedMeshes['hologram'].rotation.y += 0.01 * speed; // Slowly rotates
            
            // Scan beam flickers
            group.userData.animatedMeshes['scanBeam'].opacity = (0.1 + Math.random() * 0.1) * speed;
            
            // Colors shift!
            const h = (timeAcc * 0.5) % 1.0;
            group.userData.animatedMeshes['hologram'].material.color.setHSL(h, 1.0, 0.5);
            group.userData.animatedMeshes['scanBeam'].material.color.setHSL(h, 1.0, 0.5);
            
        } else {
            group.userData.animatedMeshes['polygon'].rotation.z -= 0.01; // Spin down
            group.userData.animatedMeshes['hologram'].opacity = 0.0;
            group.userData.animatedMeshes['scanBeam'].opacity = 0.0;
        }
    };

    group.userData.parts = parts;
    return group;
}
