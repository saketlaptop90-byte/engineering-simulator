import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // The Glass Prism
    const prismGeom = new THREE.CylinderGeometry(3, 3, 4, 3);
    const prismMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, 
        transmission: 0.95, 
        transparent: true, 
        opacity: 0.5,
        roughness: 0,
        ior: 1.5, // Index of refraction
        thickness: 3.0
    });
    const prism = new THREE.Mesh(prismGeom, prismMat);
    prism.rotation.x = Math.PI / 2;
    group.add(prism);

    // Laser Source Box
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const laserBox = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), boxMat);
    laserBox.position.set(-10, 0, 0);
    group.add(laserBox);

    // White Light Beam (Input)
    const inBeamGeom = new THREE.CylinderGeometry(0.2, 0.2, 7.5, 16);
    inBeamGeom.rotateZ(Math.PI/2);
    const inBeamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const inBeam = new THREE.Mesh(inBeamGeom, inBeamMat);
    inBeam.position.set(-5.25, 0, 0);
    group.add(inBeam);

    // Dispersion Beams (Output)
    const outGroup = new THREE.Group();
    outGroup.position.set(1.5, 0, 0); // approx exit point
    group.add(outGroup);

    // Visible spectrum colors
    const colors = [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x8f00ff];
    const numBeams = colors.length;
    const outBeams = [];

    // The Screen to project onto
    const screenGeom = new THREE.PlaneGeometry(10, 10);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide });
    const projScreen = new THREE.Mesh(screenGeom, screenMat);
    projScreen.position.set(15, -4, 0);
    projScreen.rotation.y = -Math.PI / 2;
    group.add(projScreen);

    for(let i=0; i<numBeams; i++) {
        // We make a long polygon for the beam
        // The beam will fan out. Red bends least, Violet bends most.
        const length = 15;
        const bGeom = new THREE.CylinderGeometry(0.05, 0.2, length, 16);
        bGeom.rotateZ(-Math.PI/2);
        bGeom.translate(length/2, 0, 0);
        
        const bMat = new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
        const b = new THREE.Mesh(bGeom, bMat);
        
        outGroup.add(b);
        outBeams.push(b);
    }

    // Floating particles to show light dust
    const pGeom = new THREE.BufferGeometry();
    const pCount = 500;
    const pPos = new Float32Array(pCount * 3);
    for(let i=0; i<pCount; i++) {
        pPos[i*3] = (Math.random()-0.5)*30;
        pPos[i*3+1] = (Math.random()-0.5)*20;
        pPos[i*3+2] = (Math.random()-0.5)*10;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.3 });
    const particles = new THREE.Points(pGeom, pMat);
    group.add(particles);

    let time = 0;

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

    createLabel("White Light", new THREE.Vector3(-10, 2, 0), "white");
    createLabel("Glass Prism", new THREE.Vector3(0, 4, 0), "cyan");
    createLabel("Spectrum", new THREE.Vector3(10, 3, 0), "magenta");

    group.userData.animate = (delta) => {
        time += delta;
        
        // Slowly rotate prism
        // Optimal angle for dispersion is around 30-60 degrees.
        // We'll oscillate it slightly to show dynamic refraction.
        const angle = Math.sin(time * 0.5) * 0.2 + (Math.PI/6);
        prism.rotation.y = angle;
        
        // Calculate dispersion angles based on rotation
        // Base exit angle
        const baseExit = -angle * 1.5;
        
        for(let i=0; i<numBeams; i++) {
            // Violet (highest index) bends most downwards
            const dispersionDelta = i * 0.05; 
            outBeams[i].rotation.z = baseExit - dispersionDelta;
        }

        // Dust rotation
        particles.rotation.y += delta * 0.05;
    };

    return group;
}
