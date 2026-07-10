import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Source object (e.g., an ambulance or a star)
    const sourceGeom = new THREE.SphereGeometry(0.5, 32, 32);
    const sourceMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x005500 });
    const source = new THREE.Mesh(sourceGeom, sourceMat);
    group.add(source);

    // Observer object
    const observerGeom = new THREE.BoxGeometry(0.5, 1, 0.5);
    const observerMat = new THREE.MeshStandardMaterial({ color: 0x5555ff });
    const observer = new THREE.Mesh(observerGeom, observerMat);
    observer.position.set(5, 0, 0);
    group.add(observer);

    // Expanding wave rings
    const waves = [];
    const maxWaves = 20;
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    
    // Path for the source to move along
    let sourcePos = -5;
    const sourceSpeed = 1.5; // velocity of the source
    const waveSpeed = 3.0; // velocity of the waves
    
    let emitTimer = 0;
    const emitInterval = 0.5;

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
        return sprite;
    };

    const sourceLabel = createLabel("Moving Source", new THREE.Vector3(-5, 1, 0), "white");
    createLabel("Observer (High Freq)", new THREE.Vector3(5, 1, 0), "white");
    createLabel("Observer (Low Freq)", new THREE.Vector3(-8, 1, 0), "white");

    const observer2 = new THREE.Mesh(observerGeom, observerMat);
    observer2.position.set(-8, 0, 0);
    group.add(observer2);

    group.userData.animate = (delta) => {
        // Move source
        sourcePos += sourceSpeed * delta;
        if (sourcePos > 8) {
            sourcePos = -8; // reset
        }
        source.position.set(sourcePos, 0, 0);
        sourceLabel.position.set(sourcePos, 1, 0);

        // Color shift based on direction
        const shift = sourceSpeed / waveSpeed; // roughly representing mach number
        const r = Math.min(255, Math.floor(128 * (1 - shift)));
        const b = Math.min(255, Math.floor(128 * (1 + shift)));
        sourceMat.emissive.setHex((r << 16) | b);
        sourceMat.color.setHex((r << 16) | b);

        // Emit new waves
        emitTimer += delta;
        if (emitTimer >= emitInterval) {
            emitTimer = 0;
            
            const ringGeom = new THREE.TorusGeometry(0.1, 0.02, 16, 64);
            const ring = new THREE.Mesh(ringGeom, waveMat.clone());
            ring.position.copy(source.position);
            ring.rotation.x = Math.PI / 2;
            ring.userData = { radius: 0.1, maxRadius: 15, originX: source.position.x };
            group.add(ring);
            waves.push(ring);
        }

        // Update waves
        for (let i = waves.length - 1; i >= 0; i--) {
            const w = waves[i];
            w.userData.radius += waveSpeed * delta;
            
            // Re-build geometry to scale radius properly without thickness scaling
            w.geometry.dispose();
            w.geometry = new THREE.TorusGeometry(w.userData.radius, 0.05, 16, 64);
            
            // Fade out
            w.material.opacity = 0.5 * (1 - (w.userData.radius / w.userData.maxRadius));

            if (w.userData.radius >= w.userData.maxRadius) {
                group.remove(w);
                w.geometry.dispose();
                w.material.dispose();
                waves.splice(i, 1);
            }
        }
    };

    return group;
}
