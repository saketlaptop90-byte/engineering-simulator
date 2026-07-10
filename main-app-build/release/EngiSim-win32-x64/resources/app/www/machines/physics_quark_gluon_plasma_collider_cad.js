import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const niobiumCavity = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 }); // Superconducting RF cavities
    const dipoleMagnet = new THREE.MeshPhysicalMaterial({ color: 0x2233aa, metalness: 0.4, roughness: 0.6 }); // Yoke for the bending magnets
    const siliconTracker = new THREE.MeshPhysicalMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 }); // Detector array
    const kaptonTape = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 0.1, roughness: 0.3 }); // Wiring insulation
    
    // VFX Materials
    const heavyIonVFX = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Gold/Lead nuclei
    const qgpCollisionVFX = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Quark-gluon plasma explosion
    const particleTrackVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.ions1 = [];
    group.userData.animatedMeshes.ions2 = [];
    group.userData.animatedMeshes.collision = null;
    group.userData.animatedMeshes.tracks = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Superconducting RF Cavities
    // ==========================================
    // These accelerate the particles before collision
    const acceleratorGroup = new THREE.Group();
    
    // Two opposing beamlines meeting at the center
    for(let side of [-1, 1]) {
        const beamline = new THREE.Group();
        
        // RF Cavities (Elliptical chambers to create accelerating standing waves)
        for(let i=0; i<3; i++) {
            const cavity = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), niobiumCavity);
            cavity.position.x = side * (1.5 + (i * 0.8));
            cavity.rotation.y = Math.PI/2;
            beamline.add(cavity);
        }
        
        // Superconducting Dipole Magnets (Bends the beam, here just steering it in)
        const magnet = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.0, 16).rotateZ(Math.PI/2), dipoleMagnet);
        magnet.position.x = side * 4.0;
        beamline.add(magnet);
        
        // Vacuum beam pipe
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0).rotateZ(Math.PI/2), steel);
        pipe.position.x = side * 2.5;
        beamline.add(pipe);
        
        acceleratorGroup.add(beamline);
    }
    
    group.add(acceleratorGroup);
    parts.push({ mesh: acceleratorGroup.children[0].children[0], name: "Niobium SRF Cavities", description: "Superconducting Radio Frequency cavities cooled to 2 Kelvin.", function: "Generates oscillating electromagnetic fields that accelerate heavy ions to 99.999% the speed of light."});
    parts.push({ mesh: acceleratorGroup.children[0].children[3], name: "Superconducting Dipole Magnets", description: "Massive NbTi electromagnets in an iron yoke.", function: "Steers and focuses the relativistic beam into the collision point with micrometer precision."});

    // ==========================================
    // 2. PROCEDURAL CAD: Silicon Strip Tracking Detector
    // ==========================================
    // The massive detector surrounding the collision point
    const detectorGroup = new THREE.Group();
    
    // Concentric layers of silicon detectors
    for(let i=0; i<4; i++) {
        const r = 0.4 + (i * 0.3);
        // Create a barrel of sensors
        const barrel = new THREE.Group();
        const numSensors = 8 + (i * 8);
        for(let j=0; j<numSensors; j++) {
            const angle = (j * Math.PI * 2) / numSensors;
            const sensor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 1.0), siliconTracker);
            sensor.position.set(0, r * Math.sin(angle), r * Math.cos(angle));
            sensor.rotation.x = -angle; // Face inward
            
            // Add some kapton wiring
            const wire = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.02), kaptonTape);
            wire.position.set(-0.04, 0.02, 0);
            sensor.add(wire);
            
            barrel.add(sensor);
        }
        detectorGroup.add(barrel);
    }
    
    // Outer hadronic calorimeter (cutaway)
    const calorimeter = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.4, 16, 32, Math.PI), steel);
    calorimeter.position.z = 0;
    calorimeter.rotation.y = Math.PI/2;
    detectorGroup.add(calorimeter);
    
    group.add(detectorGroup);
    parts.push({ mesh: detectorGroup.children[0].children[0], name: "Silicon Strip Tracker", description: "Concentric barrel array of millions of silicon pixels.", function: "Precisely records the trajectories of thousands of newly created particles spraying outward from the collision."});

    // ==========================================
    // 3. PROCEDURAL CAD: Collision VFX
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // Incoming Heavy Ions (e.g. Lead or Gold nuclei)
    const ion1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), heavyIonVFX);
    const ion2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), heavyIonVFX);
    vfxGroup.add(ion1, ion2);
    group.userData.animatedMeshes.ions1.push(ion1);
    group.userData.animatedMeshes.ions2.push(ion2);
    
    // The Quark-Gluon Plasma explosion at the center
    const collision = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), qgpCollisionVFX);
    vfxGroup.add(collision);
    group.userData.animatedMeshes.collision = collision;
    
    // Outgoing particle tracks (spraying radially)
    for(let i=0; i<30; i++) {
        // Curve to simulate bending in the magnetic field
        class TrackCurve extends THREE.Curve {
            constructor(phi, theta, bend) { super(); this.p = phi; this.t = theta; this.b = bend; }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const r = t * 2.0;
                // Add a spiral/bend factor
                const bendTheta = this.t + (t * this.b);
                const x = r * Math.cos(this.p);
                const y = r * Math.sin(this.p) * Math.sin(bendTheta);
                const z = r * Math.sin(this.p) * Math.cos(bendTheta);
                return optionalTarget.set(x, y, z);
            }
        }
        
        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        const bend = (Math.random() - 0.5) * 2.0; // Charge determines bend direction
        
        const trackGeo = new THREE.TubeGeometry(new TrackCurve(phi, theta, bend), 32, 0.01, 4, false);
        const track = new THREE.Mesh(trackGeo, particleTrackVFX);
        track.userData = { active: false, life: 0 };
        vfxGroup.add(track);
        group.userData.animatedMeshes.tracks.push(track);
    }
    
    group.add(vfxGroup);

    // Scale adjustment
    group.scale.set(0.5, 0.5, 0.5);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    let collisionState = 0; // 0 = approaching, 1 = exploding
    
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            if (collisionState === 0) {
                // Ions approaching from opposite sides at relativistic speeds
                const dist = 4.0 - ((timeAcc * 15 * speed) % 4.0);
                
                group.userData.animatedMeshes.ions1[0].position.x = -dist;
                group.userData.animatedMeshes.ions2[0].position.x = dist;
                
                group.userData.animatedMeshes.ions1[0].material.opacity = 1.0;
                group.userData.animatedMeshes.ions2[0].material.opacity = 1.0;
                
                group.userData.animatedMeshes.collision.material.opacity = 0;
                
                // Trigger explosion when they meet
                if (dist < 0.1) {
                    collisionState = 1;
                    timeAcc = 0; // Reset for explosion timing
                    // Activate tracks
                    group.userData.animatedMeshes.tracks.forEach(track => {
                        track.userData.active = true;
                        track.userData.life = 1.0;
                    });
                }
            } else {
                // Ions have collided
                group.userData.animatedMeshes.ions1[0].material.opacity = 0.0;
                group.userData.animatedMeshes.ions2[0].material.opacity = 0.0;
                
                // QGP Fireball expands and cools instantly
                const expTime = timeAcc * 10 * speed;
                if (expTime < 1.0) {
                    const s = 1.0 + (expTime * 2.0);
                    group.userData.animatedMeshes.collision.scale.set(s,s,s);
                    group.userData.animatedMeshes.collision.material.opacity = 1.0 - expTime;
                } else {
                    group.userData.animatedMeshes.collision.material.opacity = 0.0;
                }
                
                // Particle tracks flash outward
                let tracksAlive = false;
                group.userData.animatedMeshes.tracks.forEach(track => {
                    if (track.userData.active) {
                        track.userData.life -= 0.05 * speed;
                        if (track.userData.life > 0) {
                            track.material.opacity = track.userData.life;
                            tracksAlive = true;
                        } else {
                            track.userData.active = false;
                            track.material.opacity = 0.0;
                        }
                    }
                });
                
                // Reset to approach phase
                if (expTime > 1.0 && !tracksAlive) {
                    collisionState = 0;
                    timeAcc = 0;
                }
            }
            
        } else {
            // Idle
            group.userData.animatedMeshes.ions1[0].material.opacity = 0;
            group.userData.animatedMeshes.ions2[0].material.opacity = 0;
            group.userData.animatedMeshes.collision.material.opacity = 0;
            group.userData.animatedMeshes.tracks.forEach(track => track.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
