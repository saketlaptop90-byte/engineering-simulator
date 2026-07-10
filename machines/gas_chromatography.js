import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Oven / Enclosure (Cutaway)
    const ovenGeom = new THREE.BoxGeometry(8, 6, 4);
    const ovenMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.2, depthWrite: false });
    const oven = new THREE.Mesh(ovenGeom, ovenMat);
    group.add(oven);

    // Carrier Gas Supply
    const tankGeom = new THREE.CylinderGeometry(1, 1, 4, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x00cc44 });
    const tank = new THREE.Mesh(tankGeom, tankMat);
    tank.position.set(-6, 0, 0);
    group.add(tank);

    // Injection Port
    const portGeom = new THREE.BoxGeometry(1, 2, 1);
    const portMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const port = new THREE.Mesh(portGeom, portMat);
    port.position.set(-4, 3, 0);
    group.add(port);

    // Connecting lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 2 });
    const p1 = new THREE.Vector3(-6, 2, 0);
    const p2 = new THREE.Vector3(-6, 3, 0);
    const p3 = new THREE.Vector3(-4.5, 3, 0);
    const pipeGeom = new THREE.BufferGeometry().setFromPoints([p1, p2, p3]);
    const pipe = new THREE.Line(pipeGeom, lineMat);
    group.add(pipe);

    // The Column (Coiled Capillary Tube)
    const columnGroup = new THREE.Group();
    group.add(columnGroup);
    
    const coilPoints = [];
    const numTurns = 10;
    const height = 4;
    const radius = 2;
    for(let i=0; i<=200; i++) {
        const t = i / 200;
        const angle = t * Math.PI * 2 * numTurns;
        const y = (t - 0.5) * height;
        coilPoints.push(new THREE.Vector3(Math.cos(angle)*radius, y, Math.sin(angle)*radius));
    }
    const coilCurve = new THREE.CatmullRomCurve3(coilPoints);
    const tubeGeom = new THREE.TubeGeometry(coilCurve, 200, 0.1, 8, false);
    const tubeMat = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, transmission: 0.9, transparent: true, opacity: 0.6 });
    const tube = new THREE.Mesh(tubeGeom, tubeMat);
    columnGroup.add(tube);
    
    // Connect port to column
    const inPipeGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-4, 2, 0),
        new THREE.Vector3(-4, 2, 0),
        coilPoints[0] // Start of coil
    ]);
    const inPipe = new THREE.Line(inPipeGeom, lineMat);
    group.add(inPipe);

    // Detector
    const detGeom = new THREE.BoxGeometry(2, 2, 1.5);
    const detMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const detector = new THREE.Mesh(detGeom, detMat);
    detector.position.set(5, 0, 0);
    group.add(detector);

    // Connect column to detector
    const outPipeGeom = new THREE.BufferGeometry().setFromPoints([
        coilPoints[coilPoints.length-1], // End of coil
        new THREE.Vector3(4, 0, 0)
    ]);
    const outPipe = new THREE.Line(outPipeGeom, lineMat);
    group.add(outPipe);

    // Chromatogram Display Screen
    const screenGeom = new THREE.PlaneGeometry(5, 3);
    const canvas = document.createElement('canvas');
    canvas.width = 500; canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    const drawScreenBase = () => {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, 500, 300);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        // Grid
        for(let i=0; i<10; i++) {
            ctx.beginPath(); ctx.moveTo(i*50, 0); ctx.lineTo(i*50, 300); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i*30); ctx.lineTo(500, i*30); ctx.stroke();
        }
        ctx.fillStyle = '#0f0';
        ctx.font = '16px monospace';
        ctx.fillText("Chromatogram", 10, 20);
    };
    drawScreenBase();
    
    const tex = new THREE.CanvasTexture(canvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: tex });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(8, 4, 0);
    group.add(screen);

    // Molecules (Red=fast, Blue=slow)
    const mGeom = new THREE.SphereGeometry(0.15, 8, 8);
    const redMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const blueMat = new THREE.MeshBasicMaterial({ color: 0x0088ff });
    
    const molecules = [];
    const mGroup = new THREE.Group();
    group.add(mGroup);

    let injectTimer = 0;
    const graphData = [];
    let graphTime = 0;

    // Labels
    const createLabel = (text, pos, color) => {
        const lcan = document.createElement('canvas');
        lcan.width = 256; lcan.height = 64;
        const lctx = lcan.getContext('2d');
        lctx.fillStyle = color;
        lctx.font = 'bold 24px Arial';
        lctx.textAlign = 'center';
        lctx.fillText(text, 128, 40);
        const ltex = new THREE.CanvasTexture(lcan);
        const spriteMat = new THREE.SpriteMaterial({ map: ltex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(3, 0.75, 1);
        group.add(sprite);
    };

    createLabel("Carrier Gas (He)", new THREE.Vector3(-6, 5, 0), "lightgreen");
    createLabel("Injection Port", new THREE.Vector3(-4, 4.5, 0), "white");
    createLabel("Capillary Column (Oven)", new THREE.Vector3(0, 3.5, 0), "orange");
    createLabel("Detector", new THREE.Vector3(5, 1.5, 0), "white");

    group.userData.animate = (delta) => {
        injectTimer -= delta;
        
        // Inject a new batch of mixed molecules every 8 seconds
        if(injectTimer <= 0) {
            injectTimer = 8;
            graphData.length = 0;
            graphTime = 0;
            drawScreenBase();
            
            for(let i=0; i<40; i++) {
                const isRed = i % 2 === 0;
                const m = new THREE.Mesh(mGeom, isRed ? redMat : blueMat);
                m.userData = {
                    progress: 0,
                    speed: isRed ? 0.08 + Math.random()*0.01 : 0.04 + Math.random()*0.01,
                    type: isRed ? 'red' : 'blue'
                };
                mGroup.add(m);
                molecules.push(m);
            }
        }

        let redHits = 0;
        let blueHits = 0;

        for (let i = molecules.length - 1; i >= 0; i--) {
            const m = molecules[i];
            m.userData.progress += delta * m.userData.speed;
            
            if (m.userData.progress >= 1) {
                // Hit detector
                if (m.userData.type === 'red') redHits++;
                else blueHits++;
                
                mGroup.remove(m);
                molecules.splice(i, 1);
            } else {
                // Follow curve
                const pt = coilCurve.getPointAt(m.userData.progress);
                // Add slight jitter
                pt.x += (Math.random()-0.5)*0.1;
                pt.y += (Math.random()-0.5)*0.1;
                pt.z += (Math.random()-0.5)*0.1;
                m.position.copy(pt);
            }
        }
        
        // Update Graph
        graphTime += delta * 15;
        if(graphTime < 500) { // Screen width
            const signal = (redHits * 20) + (blueHits * 20);
            graphData.push(signal);
            
            drawScreenBase();
            ctx.beginPath();
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.moveTo(0, 280);
            for(let i=0; i<graphData.length; i++) {
                let y = 280 - graphData[i];
                if (y < 30) y = 30; // ceiling
                ctx.lineTo(i, y);
            }
            ctx.stroke();
            tex.needsUpdate = true;
        }
    };

    return group;
}
