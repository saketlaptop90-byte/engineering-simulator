import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.2 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.5 });
    const hotMetalMat = new THREE.MeshStandardMaterial({ color: 0xdd4411, metalness: 0.5, roughness: 0.5, emissive: 0xaa2200 });

    // Casing (Cutaway)
    const casingGeom = new THREE.CylinderGeometry(3, 3, 14, 32, 1, true, 0, Math.PI);
    casingGeom.rotateZ(Math.PI / 2);
    const casing = new THREE.Mesh(casingGeom, metalMat);
    casing.material.side = THREE.DoubleSide;
    group.add(casing);

    // Central Shaft
    const shaftGeom = new THREE.CylinderGeometry(0.3, 0.3, 15, 16);
    shaftGeom.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeom, metalMat);
    group.add(shaft);

    const rotors = new THREE.Group();
    shaft.add(rotors); // Attach rotors to shaft so they spin together

    // Compressor Section (Front)
    const compGeom = new THREE.BoxGeometry(0.1, 4, 0.4);
    for (let stage = 0; stage < 5; stage++) {
        const stageX = -5 + stage * 1.2;
        const numBlades = 12 + stage * 2;
        for (let i = 0; i < numBlades; i++) {
            const blade = new THREE.Mesh(compGeom, darkMetalMat);
            blade.position.set(stageX, 0, 0);
            blade.rotation.x = (i / numBlades) * Math.PI * 2;
            blade.translateY(1.2);
            rotors.add(blade);
        }
    }

    // Combustion Chamber (Middle)
    const combGeom = new THREE.CylinderGeometry(2.5, 2.5, 4, 32, 1, true, 0, Math.PI);
    combGeom.rotateZ(Math.PI / 2);
    const combChamber = new THREE.Mesh(combGeom, hotMetalMat);
    combChamber.position.set(1, 0, 0);
    combChamber.material.side = THREE.DoubleSide;
    group.add(combChamber);

    // Turbine Section (Back)
    const turbGeom = new THREE.BoxGeometry(0.1, 4.5, 0.6);
    for (let stage = 0; stage < 2; stage++) {
        const stageX = 4 + stage * 1.5;
        const numBlades = 16;
        for (let i = 0; i < numBlades; i++) {
            const blade = new THREE.Mesh(turbGeom, metalMat);
            blade.position.set(stageX, 0, 0);
            blade.rotation.x = (i / numBlades) * Math.PI * 2;
            blade.translateY(1.3);
            // twist the blade
            blade.rotation.y = 0.5;
            rotors.add(blade);
        }
    }

    // Exhaust Nozzle
    const nozGeom = new THREE.CylinderGeometry(3, 1.5, 3, 32, 1, true, 0, Math.PI);
    nozGeom.rotateZ(Math.PI / 2);
    const nozzle = new THREE.Mesh(nozGeom, darkMetalMat);
    nozzle.position.set(8.5, 0, 0);
    nozzle.material.side = THREE.DoubleSide;
    group.add(nozzle);

    // Particle Systems for Air / Fire
    const createParticles = (color, size, count) => {
        const geom = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ color: color, size: size, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
        return new THREE.Points(geom, mat);
    };

    const airParticles = createParticles(0xaaaaee, 0.2, 500);
    group.add(airParticles);
    
    const fireParticles = createParticles(0xffaa00, 0.4, 500);
    group.add(fireParticles);

    // Labels
    const createLabel = (text, pos, color) => {
        const lcan = document.createElement('canvas');
        lcan.width = 256; lcan.height = 64;
        const lctx = lcan.getContext('2d');
        lctx.fillStyle = color;
        lctx.font = 'bold 24px Arial';
        lctx.textAlign = 'center';
        lctx.fillText(text, 128, 40);
        const tex = new THREE.CanvasTexture(lcan);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(3, 0.75, 1);
        group.add(sprite);
    };

    createLabel("Intake", new THREE.Vector3(-7, 4, 0), "cyan");
    createLabel("Compressor", new THREE.Vector3(-3, 4, 0), "white");
    createLabel("Combustor", new THREE.Vector3(1, 4, 0), "orange");
    createLabel("Turbine", new THREE.Vector3(5, 4, 0), "white");
    createLabel("Exhaust", new THREE.Vector3(9, 4, 0), "red");

    group.userData.animate = (delta) => {
        // Spin the shaft and rotors
        shaft.rotation.x -= delta * 15; // High speed

        // Animate Air (Intake to Combustor)
        const aPos = airParticles.geometry.attributes.position.array;
        for (let i = 0; i < 500; i++) {
            let x = aPos[i*3];
            if (x === 0 || x > 1) {
                // reset at intake
                aPos[i*3] = -8 + Math.random();
                const angle = Math.random() * Math.PI;
                const r = Math.random() * 2.5;
                aPos[i*3+1] = Math.sin(angle) * r;
                aPos[i*3+2] = Math.cos(angle) * r;
            } else {
                aPos[i*3] += delta * 15; // Move right
                // Compression (radius shrinks)
                aPos[i*3+1] *= 0.99;
                aPos[i*3+2] *= 0.99;
            }
        }
        airParticles.geometry.attributes.position.needsUpdate = true;

        // Animate Fire (Combustor to Exhaust)
        const fPos = fireParticles.geometry.attributes.position.array;
        for (let i = 0; i < 500; i++) {
            let x = fPos[i*3];
            if (x === 0 || x > 12) {
                // reset at combustor
                fPos[i*3] = 1 + Math.random();
                const angle = Math.random() * Math.PI;
                const r = 1 + Math.random() * 1.5;
                fPos[i*3+1] = Math.sin(angle) * r;
                fPos[i*3+2] = Math.cos(angle) * r;
            } else {
                fPos[i*3] += delta * 25; // Move right faster
                // Expansion at nozzle
                if (fPos[i*3] > 8) {
                    fPos[i*3+1] *= 1.05;
                    fPos[i*3+2] *= 1.05;
                }
            }
        }
        fireParticles.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}
