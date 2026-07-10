import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Glass Tube (Vacuum)
    const tubeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.2, roughness: 0.1 });
    
    // Neck
    const neckGeom = new THREE.CylinderGeometry(1.5, 1.5, 6, 32);
    neckGeom.rotateZ(Math.PI/2);
    const neck = new THREE.Mesh(neckGeom, tubeMat);
    neck.position.set(-4, 0, 0);
    group.add(neck);
    
    // Flare / Cone
    const coneGeom = new THREE.CylinderGeometry(5, 1.5, 6, 32);
    coneGeom.rotateZ(Math.PI/2);
    const cone = new THREE.Mesh(coneGeom, tubeMat);
    cone.position.set(2, 0, 0);
    group.add(cone);
    
    // Screen (Phosphor)
    const screenGeom = new THREE.SphereGeometry(5.2, 32, 32, 0, Math.PI*2, 0, Math.PI/4);
    screenGeom.rotateZ(-Math.PI/2);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x113311, side: THREE.DoubleSide });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(1.5, 0, 0);
    group.add(screen);

    // Electron Gun
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.8 });
    
    // Heater / Cathode
    const cathode = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), gunMat);
    cathode.rotation.z = Math.PI/2;
    cathode.position.set(-6, 0, 0);
    group.add(cathode);
    
    // Anode (Focusing rings)
    const anode = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2, 16, 32), gunMat);
    anode.rotation.y = Math.PI/2;
    anode.position.set(-4, 0, 0);
    group.add(anode);

    // Deflection Plates
    const plateGeom = new THREE.BoxGeometry(1.5, 0.1, 1.5);
    const pMatY = new THREE.MeshStandardMaterial({ color: 0xff5555 }); // Y deflection
    const pMatX = new THREE.MeshStandardMaterial({ color: 0x5555ff }); // X deflection
    
    const pyTop = new THREE.Mesh(plateGeom, pMatY);
    pyTop.position.set(-2, 1, 0);
    group.add(pyTop);
    
    const pyBot = new THREE.Mesh(plateGeom, pMatY);
    pyBot.position.set(-2, -1, 0);
    group.add(pyBot);
    
    const pxLeft = new THREE.Mesh(plateGeom, pMatX);
    pxLeft.rotation.x = Math.PI/2;
    pxLeft.position.set(-0.5, 0, 1);
    group.add(pxLeft);
    
    const pxRight = new THREE.Mesh(plateGeom, pMatX);
    pxRight.rotation.x = Math.PI/2;
    pxRight.position.set(-0.5, 0, -1);
    group.add(pxRight);

    // Electron Beam (Line)
    const maxPoints = 50;
    const beamGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(maxPoints * 3);
    beamGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const beamMat = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 3 });
    const beam = new THREE.Line(beamGeom, beamMat);
    group.add(beam);
    
    // Glowing dot on screen
    const dotGeom = new THREE.SphereGeometry(0.2, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x55ff55 });
    const dot = new THREE.Mesh(dotGeom, dotMat);
    group.add(dot);

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

    createLabel("Electron Gun", new THREE.Vector3(-6, 3, 0), "white");
    createLabel("Y Deflection Plates", new THREE.Vector3(-2, 3, 0), "red");
    createLabel("X Deflection Plates", new THREE.Vector3(-0.5, -3, 0), "blue");
    createLabel("Phosphorescent Screen", new THREE.Vector3(5, 5, 0), "lightgreen");

    group.userData.animate = (delta) => {
        time += delta;
        
        // Lissajous curve input signals
        const freqX = 3;
        const freqY = 2;
        const defX = Math.sin(time * freqX) * 0.3; // Angle of deflection X
        const defY = Math.sin(time * freqY) * 0.3; // Angle of deflection Y
        
        // Calculate beam path
        const posAttr = beamGeom.attributes.position;
        const arr = posAttr.array;
        
        // Start at cathode (-6,0,0)
        let curr = new THREE.Vector3(-6, 0, 0);
        let vel = new THREE.Vector3(10, 0, 0); // initial horizontal velocity
        
        for (let i=0; i<maxPoints; i++) {
            arr[i*3] = curr.x;
            arr[i*3+1] = curr.y;
            arr[i*3+2] = curr.z;
            
            // Deflection plate zones
            if (curr.x > -2.5 && curr.x < -1.5) {
                vel.y += defY; 
            }
            if (curr.x > -1.0 && curr.x < 0) {
                vel.z += defX;
            }
            
            curr.addScaledVector(vel, 0.05); // step
            
            // Collision with screen (Roughly at x = 5)
            if (curr.x >= 4.9) {
                dot.position.copy(curr);
                // Fill remainder of array with same point
                for (let j=i+1; j<maxPoints; j++) {
                    arr[j*3] = curr.x;
                    arr[j*3+1] = curr.y;
                    arr[j*3+2] = curr.z;
                }
                break;
            }
        }
        
        posAttr.needsUpdate = true;
        
        // Make dot pulse slightly
        dot.scale.setScalar(1 + Math.random()*0.3);
    };

    return group;
}

// Auto-generated missing stub
export function createCathodeRayTube() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
