import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Structure (U-tube)
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.2, roughness: 0.1 });
    const fluidMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8 });

    // Left Cylinder (Small input)
    const c1Geom = new THREE.CylinderGeometry(1, 1, 6, 32, 1, true);
    const c1 = new THREE.Mesh(c1Geom, glassMat);
    c1.position.set(-5, 0, 0);
    group.add(c1);

    // Right Cylinder (Large output)
    const c2Geom = new THREE.CylinderGeometry(3, 3, 6, 32, 1, true);
    const c2 = new THREE.Mesh(c2Geom, glassMat);
    c2.position.set(5, 0, 0);
    group.add(c2);

    // Connecting Pipe
    const pipeGeom = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    pipeGeom.rotateZ(Math.PI/2);
    const pipe = new THREE.Mesh(pipeGeom, glassMat);
    pipe.position.set(0, -2.5, 0);
    group.add(pipe);

    // Fluid Meshes
    // C1 fluid
    const f1Geom = new THREE.CylinderGeometry(0.98, 0.98, 6, 32);
    // Translate so bottom is at -3
    f1Geom.translate(0, 3, 0);
    const f1 = new THREE.Mesh(f1Geom, fluidMat);
    f1.position.set(-5, -3, 0);
    group.add(f1);

    // C2 fluid
    const f2Geom = new THREE.CylinderGeometry(2.98, 2.98, 6, 32);
    f2Geom.translate(0, 3, 0);
    const f2 = new THREE.Mesh(f2Geom, fluidMat);
    f2.position.set(5, -3, 0);
    group.add(f2);

    // Pipe fluid
    const fpGeom = new THREE.CylinderGeometry(0.48, 0.48, 10, 16);
    fpGeom.rotateZ(Math.PI/2);
    const fp = new THREE.Mesh(fpGeom, fluidMat);
    fp.position.set(0, -2.5, 0);
    group.add(fp);

    // Pistons
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.5, 32), metalMat);
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(2.95, 2.95, 0.5, 32), metalMat);
    group.add(p2);

    // Piston Rods
    const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 16), metalMat);
    r1.position.set(-5, 4, 0);
    group.add(r1);

    const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 16), metalMat);
    r2.position.set(5, 4, 0);
    group.add(r2);

    // Weights/Force Indicators
    const w1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), new THREE.MeshStandardMaterial({color:0xff3333})); // Small force
    group.add(w1);
    
    // An object being crushed
    const blockToCrush = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), new THREE.MeshStandardMaterial({color:0x8b4513})); // Wood block
    group.add(blockToCrush);

    // Support frame above right piston
    const frame = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 6), darkMetalMat);
    frame.position.set(5, 6.25, 0);
    group.add(frame);

    let phase = 0; // 0=pressing, 1=releasing
    let inputY = 2; // initial height of piston 1 (relative to -3 center offset)

    // Gauges
    const createGauge = (title, pos) => {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const tex = new THREE.CanvasTexture(canvas);
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
        plane.position.copy(pos);
        group.add(plane);
        return { canvas, ctx, tex, title };
    };

    const g1 = createGauge("P1", new THREE.Vector3(-8, -2, 0));
    const g2 = createGauge("P2", new THREE.Vector3(9, -2, 0));

    const updateGauge = (g, pressure) => {
        g.ctx.clearRect(0,0,128,128);
        g.ctx.beginPath();
        g.ctx.arc(64, 64, 60, 0, Math.PI*2);
        g.ctx.fillStyle = '#222';
        g.ctx.fill();
        g.ctx.lineWidth = 4;
        g.ctx.strokeStyle = '#fff';
        g.ctx.stroke();
        
        g.ctx.fillStyle = '#fff';
        g.ctx.font = '16px Arial';
        g.ctx.textAlign = 'center';
        g.ctx.fillText("Pressure", 64, 30);
        g.ctx.fillText(pressure.toFixed(1) + " Pa", 64, 100);
        
        // Needle
        g.ctx.translate(64, 64);
        g.ctx.rotate(Math.PI * 0.75 + pressure * 2);
        g.ctx.beginPath();
        g.ctx.moveTo(0,0);
        g.ctx.lineTo(0, -40);
        g.ctx.strokeStyle = '#f00';
        g.ctx.stroke();
        g.ctx.rotate(-(Math.PI * 0.75 + pressure * 2));
        g.ctx.translate(-64, -64);
        
        g.tex.needsUpdate = true;
    };

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

    createLabel("Input: Force F", new THREE.Vector3(-5, 6, 0), "red");
    createLabel("Output: Force 9F", new THREE.Vector3(5, 7.5, 0), "red");
    createLabel("Area A", new THREE.Vector3(-5, 0, 2), "white");
    createLabel("Area 9A", new THREE.Vector3(5, 0, 4), "white");

    group.userData.animate = (delta) => {
        // Animation logic
        // Area of C1 = pi * 1^2 = pi
        // Area of C2 = pi * 3^2 = 9pi
        // V1 = A1 * d1
        // d2 = V1 / A2 = (A1/A2) * d1 = d1 / 9
        
        if (phase === 0) {
            inputY -= delta; // small piston moves down
            if (inputY < -1) phase = 1;
        } else {
            inputY += delta;
            if (inputY > 5) phase = 0; // reset block and everything
        }
        
        // Fluid heights (relative to bottom at -3)
        const h1 = inputY + 3; 
        f1.scale.y = h1 / 6; 
        
        // Volume displaced
        const volDisplaced = (5 - inputY) * Math.PI; // max start is 5
        const h2Increase = volDisplaced / (9 * Math.PI);
        const outputY = (-1.5) + h2Increase; // base height of output is lower to leave room for crushing
        
        const h2 = outputY + 3;
        f2.scale.y = h2 / 6;
        
        // Update pistons
        p1.position.set(-5, inputY, 0);
        r1.position.set(-5, inputY + 2, 0);
        w1.position.set(-5, inputY + 4.5, 0);
        
        p2.position.set(5, outputY, 0);
        r2.position.set(5, outputY + 2, 0);
        
        // Block to crush
        const blockBottom = outputY + 0.25; // top of piston
        const blockTopLimit = 6.0; // bottom of rigid frame
        let blockHeight = blockTopLimit - blockBottom;
        
        if (phase === 0) {
            // pressing
            if (blockHeight < 0.2) blockHeight = 0.2; // max crush
            blockToCrush.scale.y = blockHeight / 3; // original height 3
            blockToCrush.position.set(5, blockBottom + blockHeight/2, 0);
            
            // Pressure is high
            updateGauge(g1, 0.8);
            updateGauge(g2, 0.8);
        } else {
            // releasing (block stays crushed until reset)
            updateGauge(g1, 0.1);
            updateGauge(g2, 0.1);
            if(inputY > 4.8) {
                // reset block
                blockToCrush.scale.y = 1;
                blockToCrush.position.set(5, -1.25 + 1.5, 0);
            }
        }
    };

    return group;
}
