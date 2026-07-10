import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const vacuumTubeMat = new THREE.MeshPhysicalMaterial({ color: 0x99aacc, metalness: 0.8, roughness: 0.3 }); // Stainless UHV piping
    const fusedSilicaMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeff, metalness: 0.1, roughness: 0.0, transmission: 0.99, ior: 1.45, thickness: 0.5 }); // Ultra-pure glass mirrors
    const suspensionWireMat = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 }); // Fused silica fibers
    const isolationSeismicMat = new THREE.MeshPhysicalMaterial({ color: 0x445566, metalness: 0.7, roughness: 0.6 }); // Heavy dampening masses
    
    // VFX Materials
    const laserBeamVFX = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // 1064nm Nd:YAG laser (represented as green for visibility)
    const interferenceFringeVFX = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Dark/Light fringes at the detector
    const gravityWaveDistortionVFX = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.0, roughness: 0.0, transmission: 1.0, ior: 1.1, thickness: 2.0 }); // Spatial warping

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.lasers = [];
    group.userData.animatedMeshes.mirrors = [];
    group.userData.animatedMeshes.detector = null;
    group.userData.animatedMeshes.spatialWarp = null;

    // ==========================================
    // 1. PROCEDURAL CAD: Central Beam Splitter & Vacuum System
    // ==========================================
    const vacuumGroup = new THREE.Group();
    
    // Central Vertex Chamber
    const vertex = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.2, 16), vacuumTubeMat);
    vacuumGroup.add(vertex);
    
    // X and Y arms (truncated for CAD representation)
    const armLength = 3.0;
    const armGeo = new THREE.CylinderGeometry(0.5, 0.5, armLength, 16);
    
    const armX = new THREE.Mesh(armGeo, vacuumTubeMat);
    armX.rotation.z = Math.PI/2;
    armX.position.x = armLength / 2 + 0.8;
    vacuumGroup.add(armX);
    
    const armY = new THREE.Mesh(armGeo, vacuumTubeMat);
    armY.rotation.x = Math.PI/2;
    armY.position.z = armLength / 2 + 0.8;
    vacuumGroup.add(armY);
    
    // Laser Source Chamber (entering from -X)
    const sourceChamber = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.0).rotateZ(Math.PI/2), vacuumTubeMat);
    sourceChamber.position.x = -1.0;
    vacuumGroup.add(sourceChamber);
    
    // Photodetector Chamber (exiting from -Z)
    const detectorChamber = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.0).rotateX(Math.PI/2), vacuumTubeMat);
    detectorChamber.position.z = -1.0;
    vacuumGroup.add(detectorChamber);
    
    group.add(vacuumGroup);
    parts.push({ mesh: armX, name: "Ultra-High Vacuum (UHV) Beam Tubes", description: "Stainless steel piping evacuated to 10^-9 Torr.", function: "Provides an perfectly empty path for the laser beams, preventing scattering from air molecules over the multi-kilometer arms."});

    // ==========================================
    // 2. PROCEDURAL CAD: Suspended Fused Silica Test Masses
    // ==========================================
    const opticsGroup = new THREE.Group();
    
    // Beam Splitter in the vertex
    const beamSplitter = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.1), fusedSilicaMat);
    beamSplitter.rotation.y = -Math.PI/4; // 45 degree angle
    opticsGroup.add(beamSplitter);
    
    // End Mirrors (Test Masses)
    for(let i=0; i<2; i++) {
        const massGroup = new THREE.Group();
        // Position at the end of X or Y arm
        if(i===0) massGroup.position.set(armLength + 0.6, 0, 0);
        else massGroup.position.set(0, 0, armLength + 0.6);
        
        // Active Seismic Isolation System (Stacked dampeners)
        for(let s=0; s<3; s++) {
            const damp = new THREE.Mesh(new THREE.CylinderGeometry(0.3 - (s*0.05), 0.3 - (s*0.05), 0.1), isolationSeismicMat);
            damp.position.y = 1.0 - (s * 0.3);
            massGroup.add(damp);
            
            // Suspension fibers
            const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3), suspensionWireMat);
            wire1.position.set(0.2, 0.85 - (s * 0.3), 0);
            const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3), suspensionWireMat);
            wire2.position.set(-0.2, 0.85 - (s * 0.3), 0);
            massGroup.add(wire1, wire2);
        }
        
        // The highly polished Test Mass Mirror (40kg fused silica)
        const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15).rotateX(Math.PI/2), fusedSilicaMat);
        if(i===0) mirror.rotation.y = Math.PI/2; // Face the beam splitter
        mirror.position.y = 0.0;
        massGroup.add(mirror);
        
        opticsGroup.add(massGroup);
        group.userData.animatedMeshes.mirrors.push(massGroup); // Animate the whole pendulum
    }
    
    // Photodetector at the -Z output
    const detector = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), darkSteel);
    detector.position.set(0, 0, -1.3);
    opticsGroup.add(detector);
    
    // Interference Fringe screen in front of detector (VFX)
    const fringeScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.25), interferenceFringeVFX);
    fringeScreen.position.set(0, 0, -1.1);
    fringeScreen.rotation.y = Math.PI; // Face the splitter
    opticsGroup.add(fringeScreen);
    group.userData.animatedMeshes.detector = fringeScreen;
    
    group.add(opticsGroup);
    parts.push({ mesh: opticsGroup.children[1].children[6], name: "Fused Silica Test Masses", description: "40kg ultra-pure mirrors suspended by glass fibers.", function: "Acts as both the reflective mirror for the Fabry-Perot cavity and the free-falling test mass that gets physically displaced by passing gravitational waves."});

    // ==========================================
    // 3. PROCEDURAL CAD: Laser Beams & Spacetime VFX
    // ==========================================
    const laserGroup = new THREE.Group();
    
    // Input beam
    const beamIn = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.3).rotateZ(Math.PI/2), laserBeamVFX);
    beamIn.position.set(-0.65, 0, 0);
    laserGroup.add(beamIn);
    
    // X-Arm Beam
    const beamX = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, armLength + 0.6).rotateZ(Math.PI/2), laserBeamVFX);
    beamX.position.set((armLength + 0.6)/2, 0, 0);
    laserGroup.add(beamX);
    group.userData.animatedMeshes.lasers.push(beamX);
    
    // Y-Arm Beam
    const beamY = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, armLength + 0.6).rotateX(Math.PI/2), laserBeamVFX);
    beamY.position.set(0, 0, (armLength + 0.6)/2);
    laserGroup.add(beamY);
    group.userData.animatedMeshes.lasers.push(beamY);
    
    // Output beam (To detector)
    const beamOut = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1).rotateX(Math.PI/2), laserBeamVFX);
    beamOut.position.set(0, 0, -0.55);
    laserGroup.add(beamOut);
    
    group.add(laserGroup);
    
    // Gravitational Wave Spatial Warping VFX (Invisible sphere that distorts the view)
    const warpSphere = new THREE.Mesh(new THREE.SphereGeometry(6.0, 32, 32), gravityWaveDistortionVFX);
    group.add(warpSphere);
    group.userData.animatedMeshes.spatialWarp = warpSphere;

    // Scale adjustment
    group.scale.set(0.3, 0.3, 0.3);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Lasers power up
            laserGroup.children.forEach(beam => beam.material.opacity = 0.8);
            
            // 2. Gravitational Wave passes through (represented by sine wave)
            // Stretches space in one direction while compressing in the other
            const gwStrain = Math.sin(timeAcc * 10 * speed) * 0.02 * speed; // Exaggerated strain
            
            // Physical displacement of the test masses (acting as pendulums)
            group.userData.animatedMeshes.mirrors[0].position.x = (armLength + 0.6) + gwStrain;
            group.userData.animatedMeshes.mirrors[1].position.z = (armLength + 0.6) - gwStrain; // Opposite phase
            
            // Adjust laser beam lengths to match
            group.userData.animatedMeshes.lasers[0].scale.y = 1.0 + (gwStrain / (armLength + 0.6));
            group.userData.animatedMeshes.lasers[0].position.x = (armLength + 0.6 + gwStrain)/2;
            
            group.userData.animatedMeshes.lasers[1].scale.y = 1.0 - (gwStrain / (armLength + 0.6));
            group.userData.animatedMeshes.lasers[1].position.z = (armLength + 0.6 - gwStrain)/2;
            
            // 3. Interference Pattern at the detector
            // Normally tuned to destructive interference (dark fringe).
            // When strain hits, light leaks out to the detector (flashes)
            const fringeIntensity = Math.abs(gwStrain) * 50.0;
            group.userData.animatedMeshes.detector.material.opacity = fringeIntensity;
            
            // 4. Spacetime Warping VFX (The whole area distorts)
            group.userData.animatedMeshes.spatialWarp.scale.x = 1.0 + (gwStrain * 2.0);
            group.userData.animatedMeshes.spatialWarp.scale.z = 1.0 - (gwStrain * 2.0);
            
        } else {
            // Idle
            laserGroup.children.forEach(beam => beam.material.opacity = 0);
            group.userData.animatedMeshes.mirrors[0].position.x = armLength + 0.6;
            group.userData.animatedMeshes.mirrors[1].position.z = armLength + 0.6;
            group.userData.animatedMeshes.lasers[0].scale.y = 1.0;
            group.userData.animatedMeshes.lasers[1].scale.y = 1.0;
            group.userData.animatedMeshes.detector.material.opacity = 0;
            group.userData.animatedMeshes.spatialWarp.scale.set(1,1,1);
        }
    };

    group.userData.parts = parts;
    return group;
}
