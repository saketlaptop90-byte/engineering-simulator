import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Beaker / Tank
    const beakerGeom = new THREE.CylinderGeometry(4, 4, 6, 32, 1, true);
    const beakerMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.95,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
        side: THREE.DoubleSide
    });
    const beaker = new THREE.Mesh(beakerGeom, beakerMat);
    group.add(beaker);
    
    // Beaker Bottom
    const beakerBottomGeom = new THREE.CylinderGeometry(4, 4, 0.1, 32);
    const beakerBottom = new THREE.Mesh(beakerBottomGeom, beakerMat);
    beakerBottom.position.y = -3;
    group.add(beakerBottom);

    // Water level
    const waterGeom = new THREE.CylinderGeometry(3.9, 3.9, 4, 32);
    const waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x4488ff,
        transmission: 0.8,
        opacity: 0.8,
        transparent: true,
        roughness: 0.1,
        ior: 1.33
    });
    const water = new THREE.Mesh(waterGeom, waterMat);
    water.position.y = -1;
    group.add(water);

    // Electrodes
    const electrodeGeom = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const electrodeMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.5 }); // Graphite/Platinum
    
    // Anode (Positive, Oxygen)
    const anode = new THREE.Mesh(electrodeGeom, electrodeMat);
    anode.position.set(-2, -0.5, 0);
    group.add(anode);
    
    // Cathode (Negative, Hydrogen)
    const cathode = new THREE.Mesh(electrodeGeom, electrodeMat);
    cathode.position.set(2, -0.5, 0);
    group.add(cathode);

    // Wires & Battery
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), wireMat);
    wire1.position.set(-2, 3, 0);
    group.add(wire1);
    
    const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), wireMat);
    wire2.position.set(2, 3, 0);
    group.add(wire2);
    
    const wireTop = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4), wireMat);
    wireTop.rotation.z = Math.PI / 2;
    wireTop.position.set(0, 4, 0);
    group.add(wireTop);

    const batteryGeom = new THREE.BoxGeometry(1.5, 1, 1);
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const battery = new THREE.Mesh(batteryGeom, batteryMat);
    battery.position.set(0, 4, 0);
    group.add(battery);
    
    const posTerminal = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2), new THREE.MeshStandardMaterial({color: 0xff0000}));
    posTerminal.position.set(-0.4, 4.6, 0);
    group.add(posTerminal);

    const negTerminal = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2), new THREE.MeshStandardMaterial({color: 0x0000ff}));
    negTerminal.position.set(0.4, 4.6, 0);
    group.add(negTerminal);

    // Text labels
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

    createLabel("Anode (+) O2", new THREE.Vector3(-2.5, -4, 0), "white");
    createLabel("Cathode (-) H2", new THREE.Vector3(2.5, -4, 0), "white");
    createLabel("Battery", new THREE.Vector3(0, 5, 0), "white");

    // Bubbles
    const bubbles = new THREE.Group();
    group.add(bubbles);

    const o2BubbleGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const o2BubbleMat = new THREE.MeshPhysicalMaterial({ color: 0xffcccc, transmission: 0.9, opacity: 0.8, transparent: true, ior: 1.1 });
    
    const h2BubbleGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const h2BubbleMat = new THREE.MeshPhysicalMaterial({ color: 0xccffff, transmission: 0.9, opacity: 0.8, transparent: true, ior: 1.1 });

    const bubbleList = [];
    let emitTimer = 0;

    group.userData.animate = (delta) => {
        emitTimer += delta;
        
        // Spawn bubbles (H2 is produced at 2x rate of O2)
        if (emitTimer > 0.05) {
            emitTimer = 0;
            
            // O2 at Anode
            if (Math.random() > 0.5) {
                const bO2 = new THREE.Mesh(o2BubbleGeom, o2BubbleMat);
                bO2.position.set(-2 + (Math.random()-0.5)*0.5, -3 + Math.random()*2, (Math.random()-0.5)*0.5);
                bO2.userData = { speed: 1 + Math.random(), swayOffset: Math.random() * 10 };
                bubbles.add(bO2);
                bubbleList.push(bO2);
            }
            
            // H2 at Cathode (2x volume)
            for(let i=0; i<2; i++) {
                const bH2 = new THREE.Mesh(h2BubbleGeom, h2BubbleMat);
                bH2.position.set(2 + (Math.random()-0.5)*0.5, -3 + Math.random()*2, (Math.random()-0.5)*0.5);
                bH2.userData = { speed: 1.2 + Math.random(), swayOffset: Math.random() * 10 };
                bubbles.add(bH2);
                bubbleList.push(bH2);
            }
        }

        // Animate bubbles rising
        const time = Date.now() * 0.005;
        for (let i = bubbleList.length - 1; i >= 0; i--) {
            const b = bubbleList[i];
            b.position.y += b.userData.speed * delta;
            b.position.x += Math.sin(time + b.userData.swayOffset) * 0.01;
            
            if (b.position.y > 1) { // surface of water
                bubbles.remove(b);
                bubbleList.splice(i, 1);
            }
        }
    };

    return group;
}
