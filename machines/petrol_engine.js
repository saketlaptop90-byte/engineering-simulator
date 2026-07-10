import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    const blockMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.5, roughness: 0.5, transparent: true, opacity: 0.3, depthWrite: false });
    
    // Engine Block Cutaway
    const block = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 4), blockMat);
    group.add(block);
    
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 5, 32, 1, true), metalMat);
    cylinder.position.y = 0.5;
    group.add(cylinder);

    // Piston
    const pistonGeom = new THREE.CylinderGeometry(1.45, 1.45, 1, 32);
    const pistonMat = new THREE.MeshStandardMaterial({ color: 0xb5a642 }); // Brass/Alloy look
    const piston = new THREE.Mesh(pistonGeom, pistonMat);
    group.add(piston);

    // Connecting Rod
    const connRodLen = 3.5;
    const rodGeom = new THREE.CylinderGeometry(0.2, 0.2, connRodLen, 16);
    // Pivot at top
    rodGeom.translate(0, -connRodLen/2, 0);
    const rod = new THREE.Mesh(rodGeom, metalMat);
    group.add(rod);

    // Crankshaft
    const crankR = 1.2;
    const crankGeom = new THREE.BoxGeometry(0.5, crankR*2, 0.5);
    const crank = new THREE.Mesh(crankGeom, metalMat);
    crank.position.y = crankR; // Pivot at bottom
    const crankGroup = new THREE.Group();
    crankGroup.position.set(0, -3, 0);
    crankGroup.add(crank);
    group.add(crankGroup);

    // Valves
    const valveGeom = new THREE.CylinderGeometry(0.5, 0.1, 1);
    const inValve = new THREE.Mesh(valveGeom, new THREE.MeshStandardMaterial({color: 0x4444ff}));
    inValve.position.set(-0.8, 3, 0);
    group.add(inValve);
    
    const exValve = new THREE.Mesh(valveGeom, new THREE.MeshStandardMaterial({color: 0xff4444}));
    exValve.position.set(0.8, 3, 0);
    group.add(exValve);
    
    // Spark Plug
    const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5), new THREE.MeshStandardMaterial({color: 0xffffff}));
    plug.position.set(0, 3.2, 0);
    group.add(plug);
    
    // Spark Flash
    const flash = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0, blending: THREE.AdditiveBlending}));
    flash.position.set(0, 2.5, 0);
    group.add(flash);

    // Gas Particles
    const pGroup = new THREE.Group();
    group.add(pGroup);
    const pGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const inMat = new THREE.MeshBasicMaterial({ color: 0x00ccff }); // Fuel/Air
    const exMat = new THREE.MeshBasicMaterial({ color: 0x555555 }); // Exhaust
    const particles = [];
    for(let i=0; i<30; i++) {
        const p = new THREE.Mesh(pGeom, inMat);
        p.visible = false;
        pGroup.add(p);
        particles.push(p);
    }

    // Info Display
    const createScreen = (pos) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const tex = new THREE.CanvasTexture(canvas);
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), new THREE.MeshBasicMaterial({ map: tex }));
        plane.position.copy(pos);
        group.add(plane);
        return { canvas, ctx, tex };
    };
    const screen = createScreen(new THREE.Vector3(5, 0, 0));

    let crankAngle = 0;
    
    group.userData.animate = (delta) => {
        crankAngle += delta * 4; // RPM
        if(crankAngle > Math.PI * 4) crankAngle -= Math.PI * 4; // 4 strokes = 720 degrees
        
        // Mechanical Kinematics
        crankGroup.rotation.z = -crankAngle;
        
        const pinX = Math.cos(Math.PI/2 - crankAngle) * crankR;
        const pinY = Math.sin(Math.PI/2 - crankAngle) * crankR - 3; // offset crank center
        
        // Crosshead (piston) X is fixed at 0
        // (pinX - 0)^2 + (pinY - pY)^2 = L^2
        const pY = pinY + Math.sqrt(connRodLen*connRodLen - pinX*pinX);
        
        piston.position.set(0, pY, 0);
        rod.position.set(0, pY, 0);
        
        // Rod rotation
        rod.rotation.z = Math.atan2(pinX, pY - pinY);

        // Stroke Logic (0 to 4pi)
        let stroke = "";
        let color = "";
        
        const phase = crankAngle / Math.PI; // 0 to 4
        
        if (phase < 1) {
            stroke = "1. INTAKE";
            color = "#00ccff";
            inValve.position.y = 2.5; // open
            exValve.position.y = 3.0; // closed
            flash.material.opacity = 0;
            
            // Spawn particles
            particles.forEach((p, i) => {
                p.visible = true;
                p.material = inMat;
                if(Math.random() < 0.1) {
                    p.position.set(-0.8 + (Math.random()-0.5), 2.5, (Math.random()-0.5));
                } else {
                    p.position.y -= delta * 5;
                    if(p.position.y < pY + 0.5) p.position.y = pY + 0.5 + Math.random();
                }
            });
            
        } else if (phase < 2) {
            stroke = "2. COMPRESSION";
            color = "#ffaa00";
            inValve.position.y = 3.0;
            exValve.position.y = 3.0;
            
            // Particles get squeezed
            particles.forEach(p => {
                p.position.y = Math.max(pY + 0.5, Math.min(2.5, p.position.y + delta * 2));
            });
            
        } else if (phase < 3) {
            stroke = "3. POWER";
            color = "#ff0000";
            
            // Spark at top dead center
            if (phase < 2.2) {
                flash.material.opacity = 1 - ((phase-2)/0.2);
            } else {
                flash.material.opacity = 0;
            }
            
            particles.forEach(p => {
                p.material = exMat; // now exhaust
                p.position.y = Math.max(pY + 0.5, Math.min(2.5, p.position.y - delta * 5));
            });
            
        } else {
            stroke = "4. EXHAUST";
            color = "#aaaaaa";
            inValve.position.y = 3.0;
            exValve.position.y = 2.5; // open
            
            particles.forEach(p => {
                p.position.y += delta * 6;
                if(p.position.y > 3) p.visible = false;
            });
        }
        
        // Update Screen
        screen.ctx.fillStyle = '#111';
        screen.ctx.fillRect(0,0,256,128);
        screen.ctx.strokeStyle = color;
        screen.ctx.lineWidth = 4;
        screen.ctx.strokeRect(0,0,256,128);
        
        screen.ctx.fillStyle = '#fff';
        screen.ctx.font = '20px Arial';
        screen.ctx.fillText("Otto Cycle", 10, 30);
        
        screen.ctx.fillStyle = color;
        screen.ctx.font = 'bold 28px Arial';
        screen.ctx.fillText(stroke, 10, 80);
        
        screen.tex.needsUpdate = true;
    };

    return group;
}
