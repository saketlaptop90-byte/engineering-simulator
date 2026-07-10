import * as THREE from 'three';

export function createBerylliumBohrModel(scene, renderer, camera) {
    const group = new THREE.Group();

    // Classic 2D concentric rings
    // Nucleus = Be symbol in center
    
    // Create text sprite for "Be"
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#00c8ff';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Be', 128, 128);
    ctx.font = 'bold 40px Arial';
    ctx.fillText('4', 128, 190);
    
    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex });
    const nucleus = new THREE.Sprite(spriteMat);
    nucleus.scale.set(3, 3, 1);
    group.add(nucleus);

    // Orbits
    const orbitMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const eGeo = new THREE.CircleGeometry(0.2, 32);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    const shells = [
        { radius: 3, electrons: 2, speed: 0.02 },
        { radius: 5, electrons: 2, speed: 0.015 }
    ];

    const allElectrons = [];

    shells.forEach((shell, index) => {
        // Draw Ring
        const ringGeo = new THREE.RingGeometry(shell.radius - 0.05, shell.radius + 0.05, 64);
        const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
        group.add(ring);

        // Add electrons
        for(let i = 0; i < shell.electrons; i++) {
            const e = new THREE.Mesh(eGeo, eMat);
            group.add(e);
            allElectrons.push({
                mesh: e,
                radius: shell.radius,
                angle: (i / shell.electrons) * Math.PI * 2,
                speed: shell.speed
            });
        }
    });

    // Make sure it faces the camera properly
    group.rotation.x = -Math.PI / 6;

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Pulse nucleus
            nucleus.scale.setScalar(3 + Math.sin(time*4)*0.1);

            // Orbit electrons
            allElectrons.forEach(e => {
                e.angle += e.speed;
                e.mesh.position.set(
                    Math.cos(e.angle) * e.radius,
                    Math.sin(e.angle) * e.radius,
                    0
                );
            });
            
            // Gently rotate entire model for 3D feel
            group.rotation.y = Math.sin(time * 0.5) * 0.2;
            group.rotation.x = -Math.PI / 6 + Math.cos(time * 0.3) * 0.1;
        },
        cleanup: () => {
            tex.dispose();
            spriteMat.dispose();
            orbitMat.dispose();
            eGeo.dispose();
            eMat.dispose();
        }
    };
}