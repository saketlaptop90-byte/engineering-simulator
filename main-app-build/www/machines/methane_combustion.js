import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Materials for Atoms ---
    const matC = new THREE.MeshStandardMaterial({ color: 0x444444 }); // Carbon (Dark Grey)
    const matH = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Hydrogen (White)
    const matO = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Oxygen (Red)

    const atomGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const smallAtomGeo = new THREE.SphereGeometry(0.2, 16, 16);

    // --- 2. Molecule Groups ---
    // Reactants (Left side)
    const reactantsGroup = new THREE.Group();
    reactantsGroup.position.set(-3, 0, 0);
    group.add(reactantsGroup);

    // Products (Right side)
    const productsGroup = new THREE.Group();
    productsGroup.position.set(3, 0, 0);
    productsGroup.visible = false; // Hidden initially
    group.add(productsGroup);

    // --- Reactants: CH4 + 2O2 ---
    // 1x Methane (CH4)
    const ch4 = new THREE.Group();
    const c1 = new THREE.Mesh(atomGeo, matC); ch4.add(c1);
    
    // Tetrahedral arrangement for H atoms
    const r = 0.45;
    const h1 = new THREE.Mesh(smallAtomGeo, matH); h1.position.set(r, r, r); ch4.add(h1);
    const h2 = new THREE.Mesh(smallAtomGeo, matH); h2.position.set(-r, -r, r); ch4.add(h2);
    const h3 = new THREE.Mesh(smallAtomGeo, matH); h3.position.set(r, -r, -r); ch4.add(h3);
    const h4 = new THREE.Mesh(smallAtomGeo, matH); h4.position.set(-r, r, -r); ch4.add(h4);
    
    ch4.position.set(-1.5, 0, 0);
    ch4.userData = { id: 'methane', name: 'Methane (CH4)', description: 'The primary component of natural gas. Highly combustible.' };
    reactantsGroup.add(ch4);

    // 2x Oxygen (O2)
    const o2_1 = new THREE.Group();
    const oA1 = new THREE.Mesh(atomGeo, matO); oA1.position.set(-0.25, 0, 0); o2_1.add(oA1);
    const oA2 = new THREE.Mesh(atomGeo, matO); oA2.position.set(0.25, 0, 0); o2_1.add(oA2);
    o2_1.position.set(1.5, 1, 0);
    o2_1.userData = { id: 'oxygen1', name: 'Oxygen (O2)', description: 'Required for combustion. The oxidizer.' };
    reactantsGroup.add(o2_1);

    const o2_2 = new THREE.Group();
    const oB1 = new THREE.Mesh(atomGeo, matO); oB1.position.set(-0.25, 0, 0); o2_2.add(oB1);
    const oB2 = new THREE.Mesh(atomGeo, matO); oB2.position.set(0.25, 0, 0); o2_2.add(oB2);
    o2_2.position.set(1.5, -1, 0);
    reactantsGroup.add(o2_2);

    // --- Products: CO2 + 2H2O ---
    // 1x Carbon Dioxide (CO2)
    const co2 = new THREE.Group();
    const c2 = new THREE.Mesh(atomGeo, matC); co2.add(c2);
    const oC1 = new THREE.Mesh(atomGeo, matO); oC1.position.set(-0.55, 0, 0); co2.add(oC1);
    const oC2 = new THREE.Mesh(atomGeo, matO); oC2.position.set(0.55, 0, 0); co2.add(oC2);
    co2.position.set(-1, 0, 0);
    co2.userData = { id: 'co2', name: 'Carbon Dioxide (CO2)', description: 'A greenhouse gas produced by the combustion of carbon-based fuels.' };
    productsGroup.add(co2);

    // 2x Water (H2O)
    // Bent structure (~104.5 degrees)
    const h2o_1 = new THREE.Group();
    const oW1 = new THREE.Mesh(atomGeo, matO); h2o_1.add(oW1);
    const hW1 = new THREE.Mesh(smallAtomGeo, matH); hW1.position.set(-0.35, -0.35, 0); h2o_1.add(hW1);
    const hW2 = new THREE.Mesh(smallAtomGeo, matH); hW2.position.set(0.35, -0.35, 0); h2o_1.add(hW2);
    h2o_1.position.set(1.5, 1.5, 0);
    h2o_1.userData = { id: 'water1', name: 'Water (H2O)', description: 'Water vapor is the other byproduct of burning hydrocarbons.' };
    productsGroup.add(h2o_1);

    const h2o_2 = new THREE.Group();
    const oW2 = new THREE.Mesh(atomGeo, matO); h2o_2.add(oW2);
    const hW3 = new THREE.Mesh(smallAtomGeo, matH); hW3.position.set(-0.35, -0.35, 0); h2o_2.add(hW3);
    const hW4 = new THREE.Mesh(smallAtomGeo, matH); hW4.position.set(0.35, -0.35, 0); h2o_2.add(hW4);
    h2o_2.position.set(1.5, -1.5, 0);
    productsGroup.add(h2o_2);

    // --- 3. Fire / Energy Release ---
    // A particle system to represent the explosive release of heat and light
    const sparkCount = 100;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel = [];
    for(let i=0; i<sparkCount; i++){
        sparkPos[i*3] = 0; sparkPos[i*3+1] = 0; sparkPos[i*3+2] = 0;
        
        // Random explosion velocity
        const v = new THREE.Vector3(
            (Math.random()-0.5)*2,
            (Math.random()-0.5)*2,
            (Math.random()-0.5)*2
        ).normalize().multiplyScalar(2 + Math.random()*3);
        sparkVel.push(v);
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({ color: 0xffaa00, size: 0.2, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    group.add(sparks);

    // --- 4. Animation ---
    let time = 0;
    let phase = 0; // 0: Idle, 1: Reacting (Collision), 2: Explosion, 3: Products Idle

    group.userData.animate = function(delta) {
        time += delta;

        // Make molecules wobble naturally
        ch4.rotation.x += delta * 0.5;
        ch4.rotation.y += delta * 0.3;
        o2_1.rotation.y += delta * 1.2;
        o2_2.rotation.y -= delta * 1.5;

        co2.rotation.x += delta * 0.8;
        h2o_1.rotation.z -= delta * 1.0;
        h2o_2.rotation.z += delta * 1.0;

        if (phase === 0) {
            // Idle phase (Reactants)
            if (time > 2.0) {
                phase = 1; time = 0;
            }
        } 
        else if (phase === 1) {
            // Collision (Move towards center)
            const t = Math.min(time / 1.0, 1.0); // 1 sec collision
            
            reactantsGroup.position.x = -3 + (t * 3); // Move to 0
            
            // Squash together slightly
            if (t > 0.8) {
                ch4.position.x = -1.5 * (1 - (t-0.8)*5);
                o2_1.position.set(1.5 * (1 - (t-0.8)*5), 1 * (1 - (t-0.8)*5), 0);
                o2_2.position.set(1.5 * (1 - (t-0.8)*5), -1 * (1 - (t-0.8)*5), 0);
            }

            if (t === 1.0) {
                phase = 2; time = 0;
                reactantsGroup.visible = false;
                productsGroup.visible = true;
                
                // Start products at center
                productsGroup.position.x = 0;
                co2.position.x = 0;
                h2o_1.position.set(0,0,0);
                h2o_2.position.set(0,0,0);

                // Trigger Explosion
                sparkMat.opacity = 1.0;
                const sp = sparks.geometry.attributes.position.array;
                for(let i=0; i<sparkCount; i++){
                    sp[i*3] = 0; sp[i*3+1] = 0; sp[i*3+2] = 0;
                }
            }
        }
        else if (phase === 2) {
            // Explosion Expansion & Products drift right
            const t = Math.min(time / 1.5, 1.0); // 1.5 sec explosion

            productsGroup.position.x = t * 3; // Move right to 3
            co2.position.x = -1 * t;
            h2o_1.position.set(1.5*t, 1.5*t, 0);
            h2o_2.position.set(1.5*t, -1.5*t, 0);

            // Animate sparks
            const sp = sparks.geometry.attributes.position.array;
            for(let i=0; i<sparkCount; i++){
                const v = sparkVel[i];
                sp[i*3] += v.x * delta;
                sp[i*3+1] += v.y * delta;
                sp[i*3+2] += v.z * delta;
            }
            sparks.geometry.attributes.position.needsUpdate = true;
            
            sparkMat.opacity = 1.0 - t; // Fade out

            if (t === 1.0) {
                phase = 3; time = 0;
            }
        }
        else if (phase === 3) {
            // Idle Products
            if (time > 2.0) {
                // Reset
                phase = 0; time = 0;
                reactantsGroup.visible = true;
                productsGroup.visible = false;
                
                reactantsGroup.position.x = -3;
                ch4.position.set(-1.5, 0, 0);
                o2_1.position.set(1.5, 1, 0);
                o2_2.position.set(1.5, -1, 0);
            }
        }

    };

    return group;
}
