import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Earth / Crust ---
    // Surface (Grass/Soil)
    const surfaceGeo = new THREE.BoxGeometry(8, 1, 4);
    const surfaceMat = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.9 });
    const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
    surface.position.y = 2.5;
    group.add(surface);

    // Bedrock / Hot Magma Layer
    const rockGeo = new THREE.BoxGeometry(8, 5, 4);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x332222, roughness: 1.0 });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.y = -0.5;
    group.add(rock);

    // Extremely hot rock at bottom
    const magmaGeo = new THREE.BoxGeometry(8, 1.5, 4);
    const magmaMat = new THREE.MeshBasicMaterial({ color: 0xff3300 }); // Glowing red
    const magma = new THREE.Mesh(magmaGeo, magmaMat);
    magma.position.y = -3.75;
    magma.userData = { id: 'magma', name: 'Geothermal Heat Source', description: 'Extreme heat from the Earth\'s mantle radiating upward.' };
    group.add(magma);

    // --- 2. The Wells (Pipes) ---
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    
    // Injection Well (Cold Water down)
    const injectMat = new THREE.MeshStandardMaterial({ color: 0x4444aa, metalness: 0.6 });
    const injectionWell = new THREE.Mesh(pipeGeo, injectMat);
    injectionWell.position.set(-2, 0.5, 0);
    injectionWell.userData = { id: 'injection_well', name: 'Injection Well', description: 'Pumps cold water deep underground into the hot fractured rock.' };
    group.add(injectionWell);

    // Production Well (Hot Steam up)
    const prodMat = new THREE.MeshStandardMaterial({ color: 0xaa4444, metalness: 0.6 });
    const productionWell = new THREE.Mesh(pipeGeo, prodMat);
    productionWell.position.set(2, 0.5, 0);
    productionWell.userData = { id: 'production_well', name: 'Production Well', description: 'Channels the high-pressure steam back up to the surface.' };
    group.add(productionWell);

    // --- 3. Surface Plant (Turbine & Cooling Tower) ---
    // Pipe connecting production well to turbine
    const topPipeGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 16);
    const topPipe = new THREE.Mesh(topPipeGeo, prodMat);
    topPipe.rotation.z = Math.PI / 2;
    topPipe.position.set(0, 3.2, 0);
    group.add(topPipe);

    // Turbine housing
    const turbHouseGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
    const turbHouseMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 });
    const turbHouse = new THREE.Mesh(turbHouseGeo, turbHouseMat);
    turbHouse.position.set(-0.5, 3.2, 0);
    turbHouse.rotation.z = Math.PI / 2;
    group.add(turbHouse);

    // Turbine rotor (visible spinning)
    const rotorGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.05, 8); // slightly sticking out
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9 });
    const rotor = new THREE.Mesh(rotorGeo, rotorMat);
    rotor.position.set(-0.5, 3.2, 0);
    rotor.rotation.z = Math.PI / 2;
    rotor.userData = { id: 'steam_turbine', name: 'Steam Turbine', description: 'The high-pressure steam spins this turbine, generating electricity.' };
    group.add(rotor);

    // Generator
    const genGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const genMat = new THREE.MeshStandardMaterial({ color: 0xcc5500, metalness: 0.8 });
    const generator = new THREE.Mesh(genGeo, genMat);
    generator.position.set(-2, 3.6, 0);
    group.add(generator);

    // --- 4. Particles (Water and Steam) ---
    const partCount = 300;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(partCount * 3);
    const pColor = new Float32Array(partCount * 3);
    const pType = new Float32Array(partCount); // 0: cold water down, 1: hot water/steam across, 2: steam up, 3: steam across top

    for(let i=0; i<partCount; i++){
        // Initialize all particles
        pPos[i*3] = -2; // X (injection well)
        pPos[i*3+1] = 3 + Math.random()*5; // Y (staggered above)
        pPos[i*3+2] = (Math.random()-0.5)*0.2;
        pType[i] = 0; // Start as cold
        pColor[i*3] = 0.2; pColor[i*3+1] = 0.4; pColor[i*3+2] = 1.0; // Blue
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColor, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    // Electrons out of generator
    const elecCount = 20;
    const eGeo = new THREE.BufferGeometry();
    const ePos = new Float32Array(elecCount * 3);
    for(let i=0; i<elecCount; i++){
        ePos[i*3] = -2; ePos[i*3+1] = 4.2; ePos[i*3+2] = (Math.random()-0.5)*0.2;
    }
    eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
    const eMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.2, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const electrons = new THREE.Points(eGeo, eMat);
    group.add(electrons);

    // Transmission wire
    const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const wire = new THREE.Mesh(wireGeo, new THREE.MeshStandardMaterial({color: 0x111111}));
    wire.position.set(-2, 5, 0);
    group.add(wire);

    // --- 5. Animation ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;

        // Spin Turbine
        rotor.rotation.y += delta * 15;

        const pos = particles.geometry.attributes.position.array;
        const col = particles.geometry.attributes.color.array;

        for(let i=0; i<partCount; i++){
            let x = pos[i*3];
            let y = pos[i*3+1];
            let z = pos[i*3+2];
            let type = pType[i];

            if (type === 0) { // Going Down Injection Well (Cold)
                y -= delta * 3;
                col[i*3] = 0.2; col[i*3+1] = 0.4; col[i*3+2] = 1.0; // Blue
                
                if (y < -2.5) {
                    type = 1; // Reached bottom, move across rock
                }
            } 
            else if (type === 1) { // Across hot fractured rock
                x += delta * 1.5;
                // Heat up (Turn red/white)
                col[i*3] = 1.0; col[i*3+1] = 0.5 + Math.random()*0.5; col[i*3+2] = 0.5 + Math.random()*0.5;
                
                // Add jitter (boiling)
                y += (Math.random()-0.5)*0.1;
                
                if (x > 2.0) {
                    x = 2.0; // Snap to production well
                    type = 2;
                }
            }
            else if (type === 2) { // Up Production Well (Steam)
                y += delta * 6; // High pressure steam rises fast
                // Steam color (white/red)
                col[i*3] = 1.0; col[i*3+1] = 0.8; col[i*3+2] = 0.8;
                
                if (y > 3.2) {
                    y = 3.2; // Snap to top pipe
                    type = 3;
                }
            }
            else if (type === 3) { // Across top pipe to turbine
                x -= delta * 5; // Left towards turbine
                col[i*3] = 1.0; col[i*3+1] = 1.0; col[i*3+2] = 1.0; // Pure steam
                
                if (x < -0.5) { // Hit turbine
                    // Reset to start of injection well
                    type = 0;
                    x = -2.0;
                    y = 3.5 + Math.random() * 2;
                }
            }

            pType[i] = type;
            pos[i*3] = x;
            pos[i*3+1] = y;
            pos[i*3+2] = z;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;

        // Animate Electrons up the wire
        const ep = electrons.geometry.attributes.position.array;
        for(let i=0; i<elecCount; i++){
            ep[i*3+1] += delta * 3;
            if (ep[i*3+1] > 6) {
                ep[i*3+1] = 4.2;
            }
        }
        electrons.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}

// Auto-generated missing stub
export function createGeothermalPlant() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
