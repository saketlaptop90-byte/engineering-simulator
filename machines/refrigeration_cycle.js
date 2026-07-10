import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- Components ---
    // 1. Compressor
    const compGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const compMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const compressor = new THREE.Mesh(compGeo, compMat);
    compressor.position.set(-3, -2, 0);
    compressor.userData = { id: 'compressor', name: 'Compressor', description: 'Pressurizes the refrigerant gas, significantly raising its temperature.' };
    group.add(compressor);

    // 2. Condenser Coils (Hot, outside fridge)
    const condPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3, -1.25, 0),
        new THREE.Vector3(-3, 2, 0),
        new THREE.Vector3(-1, 2, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, 2, 0),
        new THREE.Vector3(3, 2, 0)
    ]);
    const condGeo = new THREE.TubeGeometry(condPath, 40, 0.15, 8, false);
    const condMat = new THREE.MeshStandardMaterial({ color: 0xaa2222, metalness: 0.6 }); // Red for hot
    const condenser = new THREE.Mesh(condGeo, condMat);
    condenser.userData = { id: 'condenser', name: 'Condenser Coils', description: 'Releases absorbed heat to the outside air, condensing the hot gas into a high-pressure liquid.' };
    group.add(condenser);

    // 3. Expansion Valve
    const valveGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const valveMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9 });
    const valve = new THREE.Mesh(valveGeo, valveMat);
    valve.position.set(3, 2, 0);
    valve.userData = { id: 'expansion_valve', name: 'Expansion Valve', description: 'Forces the high-pressure liquid through a tiny hole, causing a massive pressure and temperature drop (flash evaporation).' };
    group.add(valve);

    // 4. Evaporator Coils (Cold, inside fridge)
    const evapPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(3, 1.7, 0),
        new THREE.Vector3(3, -1, 0),
        new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(1, -3, 0),
        new THREE.Vector3(-1, -3, 0),
        new THREE.Vector3(-1, -2, 0),
        new THREE.Vector3(-2.2, -2, 0) // Back to compressor
    ]);
    const evapGeo = new THREE.TubeGeometry(evapPath, 40, 0.15, 8, false);
    const evapMat = new THREE.MeshStandardMaterial({ color: 0x2222aa, metalness: 0.6 }); // Blue for cold
    const evaporator = new THREE.Mesh(evapGeo, evapMat);
    evaporator.userData = { id: 'evaporator', name: 'Evaporator Coils', description: 'The cold liquid refrigerant absorbs heat from the inside of the fridge, boiling back into a gas.' };
    group.add(evaporator);

    // --- Particles (Refrigerant) ---
    // High-Pressure Hot Gas/Liquid (Red)
    const hotCount = 100;
    const hotGeo = new THREE.BufferGeometry();
    const hotPos = new Float32Array(hotCount * 3);
    const hProg = new Float32Array(hotCount);
    for(let i=0; i<hotCount; i++){
        hProg[i] = Math.random();
        const pt = condPath.getPoint(hProg[i]);
        hotPos[i*3] = pt.x; hotPos[i*3+1] = pt.y; hotPos[i*3+2] = pt.z;
    }
    hotGeo.setAttribute('position', new THREE.BufferAttribute(hotPos, 3));
    hotGeo.setAttribute('progress', new THREE.BufferAttribute(hProg, 1));
    const hotPMat = new THREE.PointsMaterial({ color: 0xff4444, size: 0.25, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const hotParticles = new THREE.Points(hotGeo, hotPMat);
    group.add(hotParticles);

    // Low-Pressure Cold Liquid/Gas (Blue)
    const coldCount = 100;
    const coldGeo = new THREE.BufferGeometry();
    const coldPos = new Float32Array(coldCount * 3);
    const cProg = new Float32Array(coldCount);
    for(let i=0; i<coldCount; i++){
        cProg[i] = Math.random();
        const pt = evapPath.getPoint(cProg[i]);
        coldPos[i*3] = pt.x; coldPos[i*3+1] = pt.y; coldPos[i*3+2] = pt.z;
    }
    coldGeo.setAttribute('position', new THREE.BufferAttribute(coldPos, 3));
    coldGeo.setAttribute('progress', new THREE.BufferAttribute(cProg, 1));
    const coldPMat = new THREE.PointsMaterial({ color: 0x44aaff, size: 0.25, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const coldParticles = new THREE.Points(coldGeo, coldPMat);
    group.add(coldParticles);

    // Heat radiating off condenser
    const heatCount = 50;
    const heatGeo = new THREE.BufferGeometry();
    const heatPos = new Float32Array(heatCount * 3);
    for(let i=0; i<heatCount; i++){
        heatPos[i*3] = (Math.random()-0.5)*4 - 1; // Over condenser area
        heatPos[i*3+1] = Math.random()*2;
        heatPos[i*3+2] = (Math.random()-0.5)*1;
    }
    heatGeo.setAttribute('position', new THREE.BufferAttribute(heatPos, 3));
    const heatMat = new THREE.PointsMaterial({ color: 0xff8800, size: 0.2, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    const radiatingHeat = new THREE.Points(heatGeo, heatMat);
    group.add(radiatingHeat);

    // --- Animation ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;

        // Animate Hot Refrigerant
        const hPos = hotParticles.geometry.attributes.position.array;
        const hp = hotParticles.geometry.attributes.progress.array;
        for(let i=0; i<hotCount; i++){
            hp[i] += delta * 0.2;
            if (hp[i] > 1) hp[i] = 0;
            const pt = condPath.getPoint(hp[i]);
            hPos[i*3] = pt.x; hPos[i*3+1] = pt.y; hPos[i*3+2] = pt.z;
        }
        hotParticles.geometry.attributes.position.needsUpdate = true;
        hotParticles.geometry.attributes.progress.needsUpdate = true;

        // Animate Cold Refrigerant
        const cPos = coldParticles.geometry.attributes.position.array;
        const cp = coldParticles.geometry.attributes.progress.array;
        for(let i=0; i<coldCount; i++){
            cp[i] += delta * 0.2;
            if (cp[i] > 1) cp[i] = 0;
            const pt = evapPath.getPoint(cp[i]);
            cPos[i*3] = pt.x; cPos[i*3+1] = pt.y; cPos[i*3+2] = pt.z;
        }
        coldParticles.geometry.attributes.position.needsUpdate = true;
        coldParticles.geometry.attributes.progress.needsUpdate = true;

        // Animate Radiating Heat
        const rPos = radiatingHeat.geometry.attributes.position.array;
        for(let i=0; i<heatCount; i++){
            rPos[i*3+1] += delta * 1.5; // Heat rises
            rPos[i*3] += Math.sin(time*5+i) * 0.02; // Wiggle
            if (rPos[i*3+1] > 3) {
                // Reset to condenser
                rPos[i*3] = (Math.random()-0.5)*4 - 1;
                rPos[i*3+1] = 0;
            }
        }
        radiatingHeat.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}
