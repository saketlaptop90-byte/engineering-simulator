import * as THREE from 'three';

export function createBerylliumOrbitalFillingSequence(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes the Madelung Rule (diagonal rule) 1s -> 2s -> 2p -> 3s ...
    // Shows a 3D pyramid or staggered stairs of energy levels.

    const levels = [
        { label: '1s', n: 1, l: 0, x: 0, y: -4 },
        { label: '2s', n: 2, l: 0, x: 0, y: -2 },
        { label: '2p', n: 2, l: 1, x: 2, y: -2 },
        { label: '3s', n: 3, l: 0, x: 0, y: 0 },
        { label: '3p', n: 3, l: 1, x: 2, y: 0 },
        { label: '3d', n: 3, l: 2, x: 4, y: 0 },
        { label: '4s', n: 4, l: 0, x: 0, y: 2 }
    ];

    const boxes = [];
    const createBox = (lvl) => {
        const geo = new THREE.BoxGeometry(1.5, 1, 0.5);
        // Be fills 1s and 2s. Color them differently.
        const isFilled = (lvl.label === '1s' || lvl.label === '2s');
        const color = isFilled ? 0x00ff44 : 0x444444;
        
        const mat = new THREE.MeshBasicMaterial({ color: color, wireframe: false, transparent: true, opacity: isFilled ? 0.8 : 0.3 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(lvl.x * 1.5 - 2, lvl.y * 1.5, 0);
        group.add(mesh);

        // Add edge
        const edge = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
        );
        mesh.add(edge);

        // Label
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(lvl.label, 64, 32);
        const tex = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
        sprite.scale.set(1.5, 0.75, 1);
        sprite.position.z = 0.3; // slightly in front
        mesh.add(sprite);

        return { mesh, tex, edge };
    };

    levels.forEach(l => {
        boxes.push(createBox(l));
    });

    // Draw the diagonal Madelung arrows
    const arrowMat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
    const drawArrow = (start, end) => {
        const points = [
            new THREE.Vector3(start.x * 1.5 - 2, start.y * 1.5, 0.2),
            new THREE.Vector3(end.x * 1.5 - 2, end.y * 1.5, 0.2)
        ];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geo, arrowMat);
        group.add(line);
        return { geo, line };
    };

    const arrows = [];
    // 1s
    arrows.push(drawArrow({x:0.5, y:-3.5}, {x:-0.5, y:-4.5}));
    // 2s
    arrows.push(drawArrow({x:0.5, y:-1.5}, {x:-0.5, y:-2.5}));
    // 2p -> 3s
    arrows.push(drawArrow({x:2.5, y:-1.5}, {x:-0.5, y:-0.5}));
    // 3p -> 4s
    arrows.push(drawArrow({x:2.5, y:0.5}, {x:-0.5, y:1.5}));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Pan slowly
            group.rotation.y = Math.sin(time * 0.2) * 0.2;
            group.rotation.x = Math.cos(time * 0.15) * 0.1;
            
            // Pulse the arrows to show flow direction
            arrows.forEach((a, i) => {
                a.line.material.opacity = 0.2 + (Math.sin(time*5 - i) * 0.5 + 0.5)*0.8;
                a.line.material.transparent = true;
            });
        },
        cleanup: () => {
            boxes.forEach(b => {
                b.mesh.geometry.dispose(); b.mesh.material.dispose();
                b.tex.dispose(); b.mesh.children[1].material.dispose();
                b.edge.geometry.dispose(); b.edge.material.dispose();
            });
            arrows.forEach(a => {
                a.geo.dispose(); a.line.material.dispose();
            });
        }
    };
}