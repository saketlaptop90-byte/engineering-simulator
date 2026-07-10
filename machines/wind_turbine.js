import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.4 });
    const generatorMat = new THREE.MeshStandardMaterial({ color: 0x3344cc, metalness: 0.5, roughness: 0.6 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.8 });

    // Tower
    const towerGeom = new THREE.CylinderGeometry(0.5, 1, 10, 32);
    const tower = new THREE.Mesh(towerGeom, metalMat);
    tower.position.y = -5;
    group.add(tower);

    // Nacelle (cutaway to see inside)
    const nacelleGroup = new THREE.Group();
    nacelleGroup.position.y = 0;
    group.add(nacelleGroup);
    
    // Half-shell nacelle to expose internals
    const nacelleShellGeom = new THREE.CylinderGeometry(1, 1, 4, 32, 1, false, 0, Math.PI);
    nacelleShellGeom.rotateZ(Math.PI / 2);
    const nacelleShell = new THREE.Mesh(nacelleShellGeom, metalMat);
    nacelleShell.position.set(-1, 0, 0);
    nacelleShell.rotation.x = Math.PI / 2; // Face user with cutaway
    nacelleGroup.add(nacelleShell);

    // Rotor Hub
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), metalMat);
    hub.position.set(-3.5, 0, 0);
    nacelleGroup.add(hub);

    // Blades
    const blades = new THREE.Group();
    hub.add(blades);

    const bladeGeom = new THREE.BoxGeometry(0.1, 5, 0.5);
    // Taper the blade visually
    const positions = bladeGeom.attributes.position;
    for(let i=0; i<positions.count; i++) {
        if (positions.getY(i) > 0) {
            positions.setX(i, positions.getX(i) * 0.1);
            positions.setZ(i, positions.getZ(i) * 0.5);
        }
    }
    bladeGeom.computeVertexNormals();
    
    for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(bladeGeom, bladeMat);
        blade.position.y = 2.5;
        const pivot = new THREE.Group();
        pivot.rotation.x = (i * Math.PI * 2) / 3;
        pivot.add(blade);
        // Add aerodynamic pitch
        blade.rotation.y = Math.PI / 6;
        blades.add(pivot);
    }

    // Internals: Low-speed shaft
    const lsShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16), metalMat);
    lsShaft.rotation.z = Math.PI / 2;
    lsShaft.position.set(-2.5, 0, 0);
    nacelleGroup.add(lsShaft);

    // Gearbox
    const gearbox = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 1.2), new THREE.MeshStandardMaterial({color: 0x444444}));
    gearbox.position.set(-1.25, 0, 0);
    nacelleGroup.add(gearbox);

    // High-speed shaft
    const hsShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), metalMat);
    hsShaft.rotation.z = Math.PI / 2;
    hsShaft.position.set(-0.25, 0, 0);
    nacelleGroup.add(hsShaft);

    // Generator
    const generator = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32), generatorMat);
    generator.rotation.z = Math.PI / 2;
    generator.position.set(1, 0, 0);
    nacelleGroup.add(generator);

    // Labels
    const createLabel = (text, pos, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 128, 40);
        
        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(2, 0.5, 1);
        group.add(sprite);
    };

    createLabel("Rotor Blades", new THREE.Vector3(-4, 6, 0), "white");
    createLabel("Low-Speed Shaft", new THREE.Vector3(-2.5, 2, 0), "#aaaaff");
    createLabel("Gearbox (1:100)", new THREE.Vector3(-1.25, -2, 0), "#ffaaaa");
    createLabel("Generator", new THREE.Vector3(1, 2, 0), "#aaffaa");

    // Wind particles
    const windGroup = new THREE.Group();
    group.add(windGroup);
    const windMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const windGeom = new THREE.BoxGeometry(0.5, 0.05, 0.05);

    const windParticles = [];

    group.userData.animate = (delta) => {
        // Rotate blades and low speed shaft (slow)
        blades.rotation.x -= 1.0 * delta;
        lsShaft.rotation.x -= 1.0 * delta;
        
        // Rotate high speed shaft (fast due to gearbox)
        hsShaft.rotation.x -= 10.0 * delta;

        // Wind particles
        if (Math.random() < 0.3) {
            const wind = new THREE.Mesh(windGeom, windMat);
            // spawn far left
            wind.position.set(-10, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
            windGroup.add(wind);
            windParticles.push(wind);
        }

        for(let i = windParticles.length - 1; i >= 0; i--) {
            const w = windParticles[i];
            w.position.x += 10 * delta;
            
            // Interaction: if passing through blades plane, get pushed slightly
            if (w.position.x > -4 && w.position.x < -3) {
                w.position.y += Math.sin(blades.rotation.x) * 2 * delta;
            }

            if (w.position.x > 5) {
                windGroup.remove(w);
                windParticles.splice(i, 1);
            }
        }
    };

    return group;
}

// Auto-generated missing stub
export function createWindTurbine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
