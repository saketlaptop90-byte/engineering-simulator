export function createLHCDetectorSlice(THREE) {
    const group = new THREE.Group();

    // 1. beamPipe
    const beamPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 40, 32),
        new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.8, roughness: 0.2})
    );
    beamPipe.rotation.x = Math.PI / 2;
    beamPipe.name = "BeamPipe";
    group.add(beamPipe);

    // 2. collisionPoint
    const collisionPoint = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0})
    );
    collisionPoint.name = "CollisionPoint";
    group.add(collisionPoint);

    // 3. siliconTracker
    const trackerGeo = new THREE.CylinderGeometry(1.2, 1.2, 12, 16, 4, true);
    const trackerMat = new THREE.MeshStandardMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.6});
    const siliconTracker = new THREE.Mesh(trackerGeo, trackerMat);
    siliconTracker.rotation.x = Math.PI / 2;
    siliconTracker.name = "SiliconTracker";
    group.add(siliconTracker);

    // 4. ecal
    const ecalGeo = new THREE.CylinderGeometry(2.0, 2.0, 12, 32, 1, true);
    const ecalMat = new THREE.MeshStandardMaterial({color: 0x00ff00, transparent: true, opacity: 0.3, side: THREE.DoubleSide});
    const ecal = new THREE.Mesh(ecalGeo, ecalMat);
    ecal.rotation.x = Math.PI / 2;
    ecal.name = "ElectromagneticCalorimeter";
    group.add(ecal);

    // 5. hcal
    const hcalGeo = new THREE.CylinderGeometry(3.0, 3.0, 12, 32, 1, true);
    const hcalMat = new THREE.MeshStandardMaterial({color: 0xffaa00, transparent: true, opacity: 0.3, side: THREE.DoubleSide});
    const hcal = new THREE.Mesh(hcalGeo, hcalMat);
    hcal.rotation.x = Math.PI / 2;
    hcal.name = "HadronCalorimeter";
    group.add(hcal);

    // 6. solenoid
    const solenoidGeo = new THREE.CylinderGeometry(3.5, 3.5, 13, 32, 1, true);
    const solenoidMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 0.9, roughness: 0.1, side: THREE.DoubleSide});
    const solenoid = new THREE.Mesh(solenoidGeo, solenoidMat);
    solenoid.rotation.x = Math.PI / 2;
    solenoid.name = "SuperconductingSolenoid";
    group.add(solenoid);

    // 7. muonChamber
    const muonChamberGeo = new THREE.CylinderGeometry(5.0, 5.0, 14, 8, 4, true);
    const muonChamberMat = new THREE.MeshStandardMaterial({color: 0x0000ff, wireframe: true, transparent: true, opacity: 0.8});
    const muonChamber = new THREE.Mesh(muonChamberGeo, muonChamberMat);
    muonChamber.rotation.x = Math.PI / 2;
    muonChamber.name = "MuonChambers";
    group.add(muonChamber);

    // 8. returnYoke
    const returnYokeGeo = new THREE.CylinderGeometry(5.2, 5.2, 14, 8, 1, true);
    const returnYokeMat = new THREE.MeshStandardMaterial({color: 0xff0000, transparent: true, opacity: 0.15, side: THREE.DoubleSide});
    const returnYoke = new THREE.Mesh(returnYokeGeo, returnYokeMat);
    returnYoke.rotation.x = Math.PI / 2;
    returnYoke.name = "ReturnYoke";
    group.add(returnYoke);

    // 9. protonBeams
    const protonBeams = new THREE.Group();
    const protonGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const protonMat = new THREE.MeshBasicMaterial({color: 0xffffff});
    const proton1 = new THREE.Mesh(protonGeo, protonMat);
    const proton2 = new THREE.Mesh(protonGeo, protonMat);
    protonBeams.add(proton1);
    protonBeams.add(proton2);
    protonBeams.name = "ProtonBeams";
    group.add(protonBeams);

    // 10. particleTracks
    const particleTracks = new THREE.Group();
    const particles = [];
    const particleDefs = [
        { type: 'e-', q: -1, maxR: 2.0, color: 0x00ff00, phi0: 0.5, pt: 1.0, pz: 0.1 },
        { type: 'e+', q: 1, maxR: 2.0, color: 0x00ff00, phi0: 3.5, pt: 1.2, pz: -0.1 },
        { type: 'pi+', q: 1, maxR: 3.0, color: 0xffaa00, phi0: 1.5, pt: 1.5, pz: 0.3 },
        { type: 'pi-', q: -1, maxR: 3.0, color: 0xffaa00, phi0: 4.5, pt: 1.4, pz: -0.2 },
        { type: 'mu+', q: 1, maxR: 6.0, color: 0x0000ff, phi0: 2.5, pt: 2.0, pz: 0.5 },
        { type: 'mu-', q: -1, maxR: 6.0, color: 0x0000ff, phi0: 5.5, pt: 2.2, pz: -0.4 },
        { type: 'gamma', q: 0, maxR: 2.0, color: 0xffffff, phi0: 0.0, pt: 1.5, pz: 0.0 }, 
        { type: 'n0', q: 0, maxR: 3.0, color: 0xffffff, phi0: Math.PI, pt: 1.8, pz: 0.2 } 
    ];
    
    const MAX_POINTS = 200;
    for(let def of particleDefs) {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(MAX_POINTS * 3);
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setDrawRange(0, 0);
        const mat = new THREE.LineBasicMaterial({color: def.color, linewidth: 2});
        const line = new THREE.Line(geo, mat);
        line.userData = def;
        particleTracks.add(line);
        particles.push(line);
    }
    particleTracks.name = "ParticleTracks";
    group.add(particleTracks);

    // Physical kinematics animation
    group.userData.update = function(delta, time) {
        const cycle = 4.0;
        const t = time % cycle;
        const tc = 1.0; // collision time at 1.0s

        if (t < tc) {
            // Approach phase
            const dt = t - tc; 
            const speed = 30.0; 
            const z = -dt * speed;
            proton1.position.set(0, 0, z);
            proton2.position.set(0, 0, -z);
            proton1.visible = true;
            proton2.visible = true;
            
            collisionPoint.material.opacity = 0;
            
            particles.forEach(p => {
                p.visible = false;
                p.geometry.setDrawRange(0, 0);
            });
        } else {
            // Post-collision phase
            proton1.visible = false;
            proton2.visible = false;

            const dt = t - tc;
            
            // Flash collision point
            collisionPoint.material.opacity = Math.max(0, 1.0 - dt * 4.0);
            collisionPoint.scale.setScalar(1 + dt * 5.0);

            particles.forEach(p => {
                p.visible = true;
                const def = p.userData;
                const vT = 12.0; 
                
                const dt_max = Math.min(dt, def.maxR / vT);
                if (dt_max > 0) {
                    const numPoints = Math.min(Math.floor(dt_max * 100) + 2, MAX_POINTS);
                    const positions = p.geometry.attributes.position.array;
                    const curvature = 0.2; 
                    
                    for (let i = 0; i < numPoints; i++) {
                        const tau = i * dt_max / (Math.max(1, numPoints - 1));
                        const rT = vT * tau;
                        
                        const omega = def.q !== 0 ? (tau * vT * def.q * curvature / def.pt) : 0;
                        const dir = def.phi0 + omega;
                        
                        positions[i * 3] = rT * Math.cos(dir);
                        positions[i * 3 + 1] = rT * Math.sin(dir);
                        positions[i * 3 + 2] = def.pz * vT * tau;
                    }
                    p.geometry.setDrawRange(0, numPoints);
                    p.geometry.attributes.position.needsUpdate = true;
                }
            });
        }
    };

    group.userData.quiz = [
        {
            question: "Which subdetector is closest to the collision point?",
            options: ["Silicon Tracker", "Electromagnetic Calorimeter", "Hadron Calorimeter", "Muon Chambers"],
            correct: 0
        },
        {
            question: "What stops the electrons and photons in the detector?",
            options: ["Superconducting Solenoid", "Hadron Calorimeter", "Electromagnetic Calorimeter", "Return Yoke"],
            correct: 2
        },
        {
            question: "Which particles pass through the calorimeters and are detected in the outermost layers?",
            options: ["Electrons", "Protons", "Muons", "Pions"],
            correct: 2
        },
        {
            question: "What is the purpose of the superconducting solenoid?",
            options: ["To accelerate the protons", "To bend the paths of charged particles to measure their momentum", "To stop the hadrons", "To cool down the detector"],
            correct: 1
        },
        {
            question: "Why are the proton beams steered to collide in the center?",
            options: ["To create new particles from the energy of the collision", "To destroy the protons completely", "To generate electricity", "To produce light for the calorimeters"],
            correct: 0
        },
        {
            question: "Which physical force is responsible for curving the paths of charged particles in the detector?",
            options: ["Strong Nuclear Force", "Weak Nuclear Force", "Gravitational Force", "Electromagnetic Force (Lorentz Force)"],
            correct: 3
        }
    ];

    return group;
}
