import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Earth Cross-Section ---
    const earthGeo = new THREE.BoxGeometry(10, 4, 10);
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9, transparent: true, opacity: 0.8 });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.y = -2;
    earth.userData = { id: 'soil', name: 'Soil / Earth Cross-section', description: 'The upper crust of the earth.' };
    group.add(earth);

    // Aquifer (Water table)
    const aquiferGeo = new THREE.BoxGeometry(10, 1.5, 10);
    const aquiferMat = new THREE.MeshStandardMaterial({ color: 0x0044aa, transparent: true, opacity: 0.6 });
    const aquifer = new THREE.Mesh(aquiferGeo, aquiferMat);
    aquifer.position.y = -4.75;
    aquifer.userData = { id: 'aquifer', name: 'Underground Aquifer', description: 'A body of permeable rock that contains groundwater.' };
    group.add(aquifer);

    // --- 2. Tubewell Pipe & Pump ---
    const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.y = -1;
    pipe.userData = { id: 'casing_pipe', name: 'Casing Pipe', description: 'Houses the submersible pump and guides water to the surface.' };
    group.add(pipe);

    // Submersible pump at the bottom
    const pumpGeo = new THREE.CylinderGeometry(0.28, 0.28, 1.2, 16);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.position.y = -4.5;
    pump.userData = { id: 'submersible_pump', name: 'Submersible Pump', description: 'Uses an electric motor to drive impellers that push water up.' };
    group.add(pump);
    
    // Motor shaft
    const shaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = -4.5;
    group.add(shaft);

    // Surface pipe elbow
    const elbowGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const elbow = new THREE.Mesh(elbowGeo, pipeMat);
    elbow.rotation.z = Math.PI / 2;
    elbow.position.set(1, 2, 0);
    group.add(elbow);

    // --- 3. Fluid Dynamics (Water Particles) ---
    // Particles going UP the pipe
    const upWaterCount = 100;
    const upWaterGeo = new THREE.BufferGeometry();
    const upWaterPos = new Float32Array(upWaterCount * 3);
    for(let i=0; i<upWaterCount; i++){
        upWaterPos[i*3] = (Math.random() - 0.5) * 0.4;
        upWaterPos[i*3+1] = -4 + Math.random() * 6; // Y along the pipe
        upWaterPos[i*3+2] = (Math.random() - 0.5) * 0.4;
    }
    upWaterGeo.setAttribute('position', new THREE.BufferAttribute(upWaterPos, 3));
    const waterMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.15, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const upWater = new THREE.Points(upWaterGeo, waterMat);
    upWater.userData = { id: 'upward_water', name: 'Pressurized Water', description: 'Water forced up the pipe against gravity.' };
    group.add(upWater);

    // Particles spraying OUT of the elbow (Irrigation)
    const sprayCount = 200;
    const sprayGeo = new THREE.BufferGeometry();
    const sprayPos = new Float32Array(sprayCount * 3);
    const sprayVel = [];
    for(let i=0; i<sprayCount; i++){
        sprayPos[i*3] = 2; // Start at elbow exit
        sprayPos[i*3+1] = 2;
        sprayPos[i*3+2] = (Math.random() - 0.5) * 0.4;
        
        sprayVel.push({
            x: 2 + Math.random(),
            y: 1 + Math.random(),
            z: (Math.random() - 0.5) * 0.5
        });
    }
    sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
    const sprayWater = new THREE.Points(sprayGeo, waterMat);
    sprayWater.userData = { id: 'irrigation_spray', name: 'Irrigation Spray', description: 'Water distributed onto crops using kinetic pressure.' };
    group.add(sprayWater);

    // --- 4. Animation Loop ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;

        // Spin the motor shaft
        shaft.rotation.y += delta * 20;

        // Animate upward water
        const uPos = upWater.geometry.attributes.position.array;
        for(let i=0; i<upWaterCount; i++){
            uPos[i*3+1] += delta * 4;
            if(uPos[i*3+1] > 2) {
                uPos[i*3+1] = -4; // Reset to bottom
            }
        }
        upWater.geometry.attributes.position.needsUpdate = true;

        // Animate spray (parabolic physics)
        const sPos = sprayWater.geometry.attributes.position.array;
        for(let i=0; i<sprayCount; i++){
            sPos[i*3] += sprayVel[i].x * delta; // move X
            sPos[i*3+1] += sprayVel[i].y * delta; // move Y
            sPos[i*3+2] += sprayVel[i].z * delta; // move Z
            
            // Gravity affects Y velocity
            sprayVel[i].y -= 9.8 * delta * 0.5;

            // Hit the ground
            if(sPos[i*3+1] < 0) {
                // Reset to elbow exit
                sPos[i*3] = 2;
                sPos[i*3+1] = 2;
                sPos[i*3+2] = (Math.random() - 0.5) * 0.4;
                sprayVel[i].y = 1 + Math.random(); // Reset upward velocity
            }
        }
        sprayWater.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}
