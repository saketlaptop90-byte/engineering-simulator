import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.5 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.7, roughness: 0.4 });
    const steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

    // Cylinder (cutaway)
    const cylinderGeom = new THREE.CylinderGeometry(2, 2, 6, 32, 1, true, 0, Math.PI);
    cylinderGeom.rotateZ(Math.PI/2);
    const cylinder = new THREE.Mesh(cylinderGeom, metalMat);
    cylinder.position.set(-4, 0, 0);
    group.add(cylinder);

    // Piston
    const pistonGeom = new THREE.CylinderGeometry(1.9, 1.9, 0.5, 32);
    pistonGeom.rotateZ(Math.PI/2);
    const piston = new THREE.Mesh(pistonGeom, brassMat);
    group.add(piston); // dynamic position

    // Piston Rod
    const rodGeom = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    rodGeom.rotateZ(Math.PI/2);
    const rod = new THREE.Mesh(rodGeom, metalMat);
    group.add(rod); // dynamic position

    // Flywheel
    const wheelGeom = new THREE.TorusGeometry(3, 0.5, 16, 32);
    const wheel = new THREE.Mesh(wheelGeom, darkMetalMat);
    wheel.position.set(4, 0, 0);
    group.add(wheel);

    // Crank
    const crankGeom = new THREE.BoxGeometry(0.5, 3, 0.5);
    const crank = new THREE.Mesh(crankGeom, metalMat);
    // Offset pivot
    crank.position.set(0, 1.5, 0);
    
    const crankGroup = new THREE.Group();
    crankGroup.position.set(4, 0, 0);
    crankGroup.add(crank);
    group.add(crankGroup);

    // Connecting Rod
    const connRodGeom = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    // Align so pivot is at top
    connRodGeom.translate(0, -2.5, 0);
    const connRod = new THREE.Mesh(connRodGeom, brassMat);
    group.add(connRod);

    // Steam particles
    const steamParticles = new THREE.Group();
    group.add(steamParticles);
    const pGeom = new THREE.SphereGeometry(0.3, 8, 8);
    const sArray = [];
    for(let i=0; i<50; i++){
        const s = new THREE.Mesh(pGeom, steamMat);
        steamParticles.add(s);
        sArray.push({ mesh: s, active: false });
    }

    // Valves (Visual indicators)
    const valveIn = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color:0xff0000}));
    valveIn.position.set(-6, 2.5, 0);
    group.add(valveIn);
    
    const valveOut = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color:0x0000ff}));
    valveOut.position.set(-2, 2.5, 0);
    group.add(valveOut);

    let angle = 0;

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

    createLabel("Steam Cylinder", new THREE.Vector3(-4, -3, 0), "white");
    createLabel("Piston & Rod", new THREE.Vector3(-1, -1, 0), "orange");
    createLabel("Flywheel", new THREE.Vector3(4, -4, 0), "lightgreen");
    createLabel("Intake", new THREE.Vector3(-6, 4, 0), "red");
    createLabel("Exhaust", new THREE.Vector3(-2, 4, 0), "blue");

    group.userData.animate = (delta) => {
        angle += delta * 3; // RPM
        
        // Crank rotation
        crankGroup.rotation.z = angle;
        wheel.rotation.z = angle;
        
        // Calculate crank pin position
        const crankPinX = 4 + Math.cos(angle + Math.PI/2) * 1.5;
        const crankPinY = Math.sin(angle + Math.PI/2) * 1.5;
        
        // Connecting rod length = 5
        // crosshead X position: 
        // (crankPinX - x)^2 + (crankPinY - 0)^2 = L^2
        const L = 5;
        const dx = Math.sqrt(L*L - crankPinY*crankPinY);
        const crossheadX = crankPinX - dx;
        
        // Update piston and rod
        piston.position.set(crossheadX - 3, 0, 0); // piston is offset from crosshead
        rod.position.set(crossheadX - 3 + 3, 0, 0); // rod extends from piston to crosshead
        
        // Connect rod from crank pin to crosshead
        connRod.position.set(crankPinX, crankPinY, 0);
        // Angle points to crosshead
        const dX = crossheadX - crankPinX;
        const dY = 0 - crankPinY;
        connRod.rotation.z = Math.atan2(dY, dX) + Math.PI/2;

        // Steam logic (Double acting approximation)
        const isPushingRight = Math.sin(angle) > 0;
        
        valveIn.material.color.setHex(isPushingRight ? 0xff0000 : 0x550000);
        valveOut.material.color.setHex(isPushingRight ? 0x000055 : 0x0000ff);

        // Animate particles
        sArray.forEach(s => {
            if(!s.active && Math.random() < 0.1) {
                s.active = true;
                if(isPushingRight) {
                    // Enter left
                    s.mesh.position.set(-6 + (Math.random()-0.5), (Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5);
                    s.mesh.userData.vel = new THREE.Vector3(2, 0, 0);
                } else {
                    // Vent right
                    s.mesh.position.set(piston.position.x + Math.random(), (Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5);
                    s.mesh.userData.vel = new THREE.Vector3(0, 3, 0); // vent up
                }
            }
            
            if(s.active) {
                s.mesh.position.addScaledVector(s.mesh.userData.vel, delta);
                
                // Fade out
                s.mesh.scale.multiplyScalar(0.95);
                
                if (s.mesh.position.x > piston.position.x || s.mesh.position.y > 4) {
                    s.active = false;
                    s.mesh.scale.set(1,1,1);
                    s.mesh.position.set(100,100,100);
                }
            }
        });
    };

    return group;
}

// Auto-generated missing stub
export function createSteamEngine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
