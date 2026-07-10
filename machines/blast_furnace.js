import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Blast Furnace Structure (Cutaway)
    const furnaceGroup = new THREE.Group();
    group.add(furnaceGroup);

    // Outer Shell
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x554444, roughness: 0.9, metalness: 0.1 });
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xaa4422, roughness: 1, metalness: 0, emissive: 0x331100 });
    
    // Stack (Top)
    const stackGeom = new THREE.CylinderGeometry(2, 3, 5, 32, 1, true, Math.PI, Math.PI);
    const stack = new THREE.Mesh(stackGeom, shellMat);
    stack.position.set(0, 2.5, 0);
    furnaceGroup.add(stack);
    
    // Bosh (Middle)
    const boshGeom = new THREE.CylinderGeometry(3, 2.5, 3, 32, 1, true, Math.PI, Math.PI);
    const bosh = new THREE.Mesh(boshGeom, innerMat);
    bosh.position.set(0, -1.5, 0);
    furnaceGroup.add(bosh);
    
    // Hearth (Bottom)
    const hearthGeom = new THREE.CylinderGeometry(2.5, 2.5, 2, 32, 1, true, Math.PI, Math.PI);
    const hearth = new THREE.Mesh(hearthGeom, innerMat);
    hearth.position.set(0, -4, 0);
    furnaceGroup.add(hearth);

    // Tuyeres (Air pipes)
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const pipeGeom = new THREE.CylinderGeometry(0.3, 0.3, 2);
    pipeGeom.rotateZ(Math.PI/2);
    
    const tLeft = new THREE.Mesh(pipeGeom, pipeMat);
    tLeft.position.set(-3, -3, 0);
    furnaceGroup.add(tLeft);
    
    const tRight = new THREE.Mesh(pipeGeom, pipeMat);
    tRight.position.set(3, -3, 0);
    furnaceGroup.add(tRight);

    // Molten Iron & Slag pools
    const ironGeom = new THREE.CylinderGeometry(2.4, 2.4, 0.8, 32, 1, false, Math.PI, Math.PI);
    const ironMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const iron = new THREE.Mesh(ironGeom, ironMat);
    iron.position.set(0, -4.6, 0);
    group.add(iron);
    
    const slagGeom = new THREE.CylinderGeometry(2.4, 2.4, 0.4, 32, 1, false, Math.PI, Math.PI);
    const slagMat = new THREE.MeshBasicMaterial({ color: 0x665544 });
    const slag = new THREE.Mesh(slagGeom, slagMat);
    slag.position.set(0, -4.0, 0);
    group.add(slag);

    // Tapping holes
    const tapIron = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 0.4), ironMat);
    tapIron.position.set(2, -4.8, 0);
    group.add(tapIron);
    
    const tapSlag = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 0.4), slagMat);
    tapSlag.position.set(-2, -4.0, 0);
    group.add(tapSlag);

    // Falling Particles (Ore, Coke, Limestone)
    const pGroup = new THREE.Group();
    group.add(pGroup);
    
    const oreMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const cokeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const limeMat = new THREE.MeshStandardMaterial({ color: 0xddddcc });
    
    const particles = [];
    
    let timer = 0;

    // Glowing Gas / Fire
    const fireGeom = new THREE.BufferGeometry();
    const fireCount = 100;
    const firePos = new Float32Array(fireCount * 3);
    for(let i=0; i<fireCount; i++) {
        firePos[i*3] = (Math.random()-0.5)*4;
        firePos[i*3+1] = -3 + Math.random()*8;
        firePos[i*3+2] = (Math.random()-0.5)*2;
    }
    fireGeom.setAttribute('position', new THREE.BufferAttribute(firePos, 3));
    const fireMat = new THREE.PointsMaterial({ color: 0xff5500, size: 0.5, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const fireParticles = new THREE.Points(fireGeom, fireMat);
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

    createLabel("Ore + Coke + Limestone", new THREE.Vector3(0, 6, 0), "white");
    createLabel("Hot Air Blast (Tuyeres)", new THREE.Vector3(-5, -3, 0), "cyan");
    createLabel("Molten Slag", new THREE.Vector3(-4, -4, 0), "#887766");
    createLabel("Molten Iron", new THREE.Vector3(4, -5, 0), "orange");

    group.userData.animate = (delta) => {
        timer += delta;
        
        // Spawn solid charges at top
        if(timer > 0.2) {
            timer = 0;
            const type = Math.random();
            let mat;
            if(type < 0.5) mat = oreMat;
            else if(type < 0.8) mat = cokeMat;
            else mat = limeMat;
            
            const p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3), mat);
            p.position.set((Math.random()-0.5)*2, 5, (Math.random()-0.5)*2);
            pGroup.add(p);
            particles.push(p);
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Gravity
            p.position.y -= delta * 2;
            
            // Turn bright hot as it falls
            if(p.position.y < 0) {
                p.material = new THREE.MeshBasicMaterial({ color: 0xff4400 });
            }
            
            // Melt into pools
            if(p.position.y < -3.5) {
                pGroup.remove(p);
                particles.splice(i, 1);
            }
        }
        
        // Animate fire gas moving UP
        const fPos = fireGeom.attributes.position.array;
        for(let i=0; i<fireCount; i++) {
            fPos[i*3+1] += delta * 5;
            // Wiggle x
            fPos[i*3] += (Math.random()-0.5)*0.2;
            
            if(fPos[i*3+1] > 5) {
                fPos[i*3+1] = -3;
                fPos[i*3] = (Math.random()-0.5)*4;
            }
        }
        fireGeom.attributes.position.needsUpdate = true;
    };

    return group;
}
