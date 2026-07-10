import * as THREE from 'three';

export function createBerylliumIonicRadius(scene, renderer, camera) {
    const group = new THREE.Group();

    // Compares neutral Be (112 pm) with Be2+ ion (31 pm).
    // Be2+ is incredibly small because it loses its entire n=2 shell, 
    // leaving only the tightly bound n=1 core (high Zeff).

    // Scale mapping: 112 pm -> 4 units, 31 pm -> 1.1 units
    const neutralR = 4;
    const ionicR = 1.1;

    // Neutral Be outline (ghostly)
    const neutralGeo = new THREE.SphereGeometry(neutralR, 32, 32);
    const neutralMat = new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true, transparent: true, opacity: 0.2 });
    const neutralMesh = new THREE.Mesh(neutralGeo, neutralMat);
    group.add(neutralMesh);

    // Be2+ Ion (solid, bright)
    const ionicGeo = new THREE.SphereGeometry(ionicR, 64, 64);
    const ionicMat = new THREE.MeshPhysicalMaterial({ color: 0xff0044, transmission: 0.5, opacity: 0.8, transparent: true, roughness: 0.1 });
    const ionicMesh = new THREE.Mesh(ionicGeo, ionicMat);
    group.add(ionicMesh);

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    // Labels
    const createLabel = (text, y, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 64);
        const tex = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
        sprite.scale.set(6, 1.5, 1);
        sprite.position.set(0, y, 0);
        group.add(sprite);
        return { tex, sprite };
    };

    const l1 = createLabel('Neutral Be (112 pm)', 4.8, '#aaaaaa');
    const l2 = createLabel('Be2+ Ion (31 pm)', 1.8, '#ff88aa');

    // Arrows pointing to radius
    const a1 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), neutralR, 0xaaaaaa, 0.4, 0.2);
    group.add(a1);
    
    const a2 = new THREE.ArrowHelper(new THREE.Vector3(-1,0,0), new THREE.Vector3(0,0,0), ionicR, 0xff88aa, 0.3, 0.15);
    group.add(a2);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;
            
            // Animation: Pulse between neutral size and ionic size to show the massive contraction
            const cycle = (Math.sin(time * 2) + 1) / 2; // 0 to 1
            
            // When cycle = 1, we show neutral Be. When cycle = 0, it shrinks to Be2+
            ionicMesh.scale.setScalar(1 + (neutralR/ionicR - 1) * cycle);
            
            // Transition color from neutral (blueish) to ionic (reddish)
            ionicMesh.material.color.setHSL( 0.5 - (0.5 * (1-cycle)), 1.0, 0.5 );
            
            // Arrow 2 tracks the shrinking boundary
            const currentR = ionicR + (neutralR - ionicR) * cycle;
            a2.setLength(currentR, 0.3, 0.15);
            l2.sprite.position.y = currentR + 0.7;

            neutralMesh.rotation.y = time * 0.2;
            neutralMesh.rotation.x = time * 0.1;
        },
        cleanup: () => {
            neutralGeo.dispose(); neutralMat.dispose();
            ionicGeo.dispose(); ionicMat.dispose();
            nucleus.geometry.dispose(); nucleus.material.dispose();
            l1.tex.dispose(); l1.sprite.material.dispose();
            l2.tex.dispose(); l2.sprite.material.dispose();
            a1.line.geometry.dispose(); a1.cone.geometry.dispose();
            a2.line.geometry.dispose(); a2.cone.geometry.dispose();
        }
    };
}