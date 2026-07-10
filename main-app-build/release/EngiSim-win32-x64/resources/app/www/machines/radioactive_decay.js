import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Parent Nucleus (Uranium-238) ---
    const nucleusGroup = new THREE.Group();
    const nucleonGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const protonMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.1, roughness: 0.8 });
    const neutronMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.1, roughness: 0.8 });
    
    // We won't draw all 238 nucleons for performance, but we'll draw a dense cluster of ~80
    const nucleons = [];
    for(let i=0; i<80; i++){
        const isProton = i % 2 === 0;
        const nucleon = new THREE.Mesh(nucleonGeo, isProton ? protonMat : neutronMat);
        
        nucleon.position.set(
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 2.5
        );
        // Push outwards into a rough sphere shape
        nucleon.position.normalize().multiplyScalar(Math.random() * 1.5);

        nucleons.push({ mesh: nucleon, basePos: nucleon.position.clone() });
        nucleusGroup.add(nucleon);
    }
    nucleusGroup.userData = { id: 'parent_nucleus', name: 'Unstable Nucleus (Uranium-238)', description: 'A highly massive, unstable isotope. The strong nuclear force barely holds it together against electromagnetic repulsion.' };
    group.add(nucleusGroup);

    // --- 2. Alpha Particle (He nucleus: 2 protons, 2 neutrons) ---
    const alphaGroup = new THREE.Group();
    const aP1 = new THREE.Mesh(nucleonGeo, protonMat); aP1.position.set(0.15, 0.15, 0); alphaGroup.add(aP1);
    const aP2 = new THREE.Mesh(nucleonGeo, protonMat); aP2.position.set(-0.15, -0.15, 0); alphaGroup.add(aP2);
    const aN1 = new THREE.Mesh(nucleonGeo, neutronMat); aN1.position.set(-0.15, 0.15, 0); alphaGroup.add(aN1);
    const aN2 = new THREE.Mesh(nucleonGeo, neutronMat); aN2.position.set(0.15, -0.15, 0); alphaGroup.add(aN2);
    
    alphaGroup.position.set(1.5, 0, 0);
    alphaGroup.visible = false;
    alphaGroup.userData = { id: 'alpha_particle', name: 'Alpha Particle (Helium-4)', description: 'Ejected at high velocity during decay, reducing the parent atom\'s mass by 4 and atomic number by 2 (becoming Thorium-234).' };
    group.add(alphaGroup);

    // Energy wave / Radiation Flash
    const flashGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    group.add(flash);

    // --- 3. Animation State ---
    let time = 0;
    let phase = 0; // 0: Vibrating/Unstable, 1: Decay Flash, 2: Alpha Ejection, 3: Stable (Thorium)

    group.userData.animate = function(delta) {
        time += delta;

        if (phase === 0) {
            // Highly unstable vibration
            const intensity = 0.05 + (time * 0.01); // Vibration increases over time
            nucleons.forEach(n => {
                n.mesh.position.copy(n.basePos);
                n.mesh.position.x += (Math.random() - 0.5) * intensity;
                n.mesh.position.y += (Math.random() - 0.5) * intensity;
                n.mesh.position.z += (Math.random() - 0.5) * intensity;
            });

            if (time > 4.0) {
                phase = 1;
                alphaGroup.visible = true;
                alphaGroup.position.set(1.5, 0, 0);
            }
        } else if (phase === 1) {
            // Flash of Gamma / Kinetic Energy
            flashMat.opacity = 0.8;
            flash.scale.set(1,1,1);
            phase = 2;
        } else if (phase === 2) {
            // Alpha particle shoots out
            alphaGroup.position.x += delta * 15; // High velocity
            alphaGroup.rotation.z += delta * 10;
            alphaGroup.rotation.x += delta * 5;

            // Flash dissipates and expands
            flashMat.opacity -= delta * 2;
            flash.scale.addScalar(delta * 5);
            if (flashMat.opacity < 0) flashMat.opacity = 0;

            // Nucleus recoils slightly and stabilizes
            if (nucleusGroup.position.x > -0.5) {
                nucleusGroup.position.x -= delta * 2;
            }

            // Calm the vibrations
            nucleons.forEach(n => {
                n.mesh.position.lerp(n.basePos, delta * 5);
            });

            if (alphaGroup.position.x > 15) {
                phase = 3;
            }
        } else if (phase === 3) {
            // Stable, wait to reset
            if (time > 8.0) {
                time = 0;
                phase = 0;
                nucleusGroup.position.x = 0;
                alphaGroup.visible = false;
            }
        }
    };

    return group;
}
