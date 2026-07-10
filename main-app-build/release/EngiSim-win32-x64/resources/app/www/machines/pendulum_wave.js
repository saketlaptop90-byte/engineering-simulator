import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Support Structure ---
    const barGeo = new THREE.BoxGeometry(6, 0.2, 0.2);
    const barMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(0, 3, 0);
    group.add(bar);

    const legGeo = new THREE.BoxGeometry(0.2, 6, 0.2);
    const leg1 = new THREE.Mesh(legGeo, barMat);
    leg1.position.set(-2.9, 0, 0);
    group.add(leg1);
    
    const leg2 = new THREE.Mesh(legGeo, barMat);
    leg2.position.set(2.9, 0, 0);
    group.add(leg2);

    bar.userData = { id: 'pendulum_wave', name: 'Pendulum Wave', description: 'A series of uncoupled pendulums of monotonically increasing lengths. When released together, their differing oscillation frequencies create beautiful, repeating wave patterns and chaotic states before realigning.' };

    // --- 2. The Pendulums ---
    const pCount = 15;
    const pendulums = [];
    
    const bobGeo = new THREE.SphereGeometry(0.15, 16, 16);
    
    // We want the longest pendulum to execute N oscillations in time T (e.g. 60 seconds)
    // The next one executes N+1, then N+2, etc.
    // T = 2 * pi * sqrt(L / g) => L = g * (T / (2*pi*N))^2
    
    const T_cycle = 20; // 20 seconds for a full pattern cycle
    const N_base = 15; // Longest pendulum does 15 oscillations in T_cycle
    const g = 9.81;

    for (let i = 0; i < pCount; i++) {
        const pGroup = new THREE.Group();
        
        // Calculate length based on required frequency
        const N = N_base + i;
        const L = g * Math.pow(T_cycle / (2 * Math.PI * N), 2) * 5; // *5 is just a visual scale factor
        
        // The pivot
        const pivotX = -2.5 + (i * (5.0 / (pCount - 1)));
        pGroup.position.set(pivotX, 3, 0);
        
        // The string
        const stringGeo = new THREE.CylinderGeometry(0.01, 0.01, L, 4);
        const stringMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        const string = new THREE.Mesh(stringGeo, stringMat);
        // Cylinder is centered, move it down so top is at pivot
        string.position.y = -L / 2;
        pGroup.add(string);

        // The Bob
        // Color gradient from red to blue
        const hue = i / pCount;
        const color = new THREE.Color().setHSL(hue, 1, 0.5);
        const bobMat = new THREE.MeshStandardMaterial({ color: color, metalness: 0.8, roughness: 0.2 });
        const bob = new THREE.Mesh(bobGeo, bobMat);
        bob.position.y = -L;
        pGroup.add(bob);

        group.add(pGroup);
        
        // Calculate the angular frequency omega
        const omega = Math.sqrt(g / L);
        
        pendulums.push({
            group: pGroup,
            omega: omega,
            maxAngle: Math.PI / 4 // 45 degrees initial release
        });
    }

    // --- 3. Animation ---
    let time = 0;

    group.userData.animate = function(delta) {
        time += delta;

        // Theta(t) = Theta_max * cos(omega * t)
        for (let i = 0; i < pCount; i++) {
            const p = pendulums[i];
            const theta = p.maxAngle * Math.cos(p.omega * time * 2); // *2 speedup for visualization
            
            // Swing along the Z axis
            p.group.rotation.x = theta;
        }
    };

    return group;
}
