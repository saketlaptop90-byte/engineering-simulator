import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Bar Magnet ---
    const magnetGroup = new THREE.Group();
    group.add(magnetGroup);

    // North Pole (Red)
    const nGeo = new THREE.BoxGeometry(2, 1, 1);
    const nMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.3, roughness: 0.5 });
    const nPole = new THREE.Mesh(nGeo, nMat);
    nPole.position.set(1, 0, 0);
    magnetGroup.add(nPole);
    
    // South Pole (Blue)
    const sGeo = new THREE.BoxGeometry(2, 1, 1);
    const sMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.3, roughness: 0.5 });
    const sPole = new THREE.Mesh(sGeo, sMat);
    sPole.position.set(-1, 0, 0);
    magnetGroup.add(sPole);

    magnetGroup.userData = { id: 'bar_magnet', name: 'Permanent Bar Magnet', description: 'Has a North (Red) and South (Blue) pole. Magnetic field lines emerge from the North pole and curve around to enter the South pole.' };

    // Add labels "N" and "S" using simple geometry (for simplicity, just colored boxes for now)
    const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const nLine1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.1), textMat); nLine1.position.set(1.2, 0, 0.51); magnetGroup.add(nLine1);
    const sLine1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), textMat); sLine1.position.set(-1.2, 0, 0.51); magnetGroup.add(sLine1);

    // --- 2. Iron Filings (Field Lines) ---
    // We will simulate iron filings forming magnetic field lines around the magnet
    const filingCount = 3000;
    
    // Use an instanced mesh to render thousands of tiny iron filings efficiently
    const filingGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 4); // Tiny thin cylinder
    filingGeo.rotateZ(Math.PI / 2); // Point along X axis by default
    const filingMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.5 });
    
    const instancedFilings = new THREE.InstancedMesh(filingGeo, filingMat, filingCount);
    group.add(instancedFilings);

    instancedFilings.userData = { id: 'iron_filings', name: 'Iron Filings', description: 'Tiny pieces of iron that act like tiny compasses, aligning themselves tangent to the magnetic field lines.' };

    const dummy = new THREE.Object3D();
    
    // Function to calculate magnetic field B at a given point (x,y,z) due to a dipole
    // Simplified dipole model: two magnetic charges at +/- d
    function getBField(x, y, z) {
        const d = 1.5; // distance of poles from center
        const m = 5.0; // "magnetic charge" strength
        
        // Vector from North pole (d, 0, 0)
        const rx_N = x - d;
        const ry_N = y;
        const rz_N = z;
        const r_N_sq = rx_N*rx_N + ry_N*ry_N + rz_N*rz_N;
        const r_N = Math.sqrt(r_N_sq);
        
        // Vector from South pole (-d, 0, 0)
        const rx_S = x + d;
        const ry_S = y;
        const rz_S = z;
        const r_S_sq = rx_S*rx_S + ry_S*ry_S + rz_S*rz_S;
        const r_S = Math.sqrt(r_S_sq);
        
        // B = B_N + B_S
        // B_N points away from North pole: m * (r_N_vec) / r_N^3
        // B_S points towards South pole: -m * (r_S_vec) / r_S^3
        
        const Bx = m * (rx_N / (r_N_sq * r_N)) - m * (rx_S / (r_S_sq * r_S));
        const By = m * (ry_N / (r_N_sq * r_N)) - m * (ry_S / (r_S_sq * r_S));
        const Bz = m * (rz_N / (r_N_sq * r_N)) - m * (rz_S / (r_S_sq * r_S));
        
        return new THREE.Vector3(Bx, By, Bz);
    }

    // Initialize filing positions randomly in a box around the magnet
    const filingData = [];
    for (let i = 0; i < filingCount; i++) {
        // Random position, avoiding the interior of the magnet
        let px, py, pz;
        do {
            px = (Math.random() - 0.5) * 12;
            py = (Math.random() - 0.5) * 12;
            pz = (Math.random() - 0.5) * 4;
        } while (Math.abs(px) < 2 && Math.abs(py) < 0.8 && Math.abs(pz) < 0.8);
        
        filingData.push({ x: px, y: py, z: pz });
    }

    // --- 3. Animation ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;
        
        // Slowly rotate the entire group to show 3D nature
        group.rotation.y = Math.sin(time * 0.2) * 0.5;
        group.rotation.x = Math.sin(time * 0.3) * 0.2;

        // Animate the filings slightly (like they are being sprinkled or vibrating into place)
        for (let i = 0; i < filingCount; i++) {
            const data = filingData[i];
            
            // Calculate B field at this point
            const B = getBField(data.x, data.y, data.z);
            
            // Normalize B to get direction
            B.normalize();
            
            // Position
            dummy.position.set(data.x, data.y, data.z);
            
            // Rotation: align dummy's X axis with B vector
            // The default filing is oriented along X.
            // LookAt creates rotation such that Z axis points to target.
            // We want X axis to point to B.
            
            // Math trick: Create a target point slightly along B
            const target = new THREE.Vector3(data.x + B.x, data.y + B.y, data.z + B.z);
            
            // Save dummy up vector
            dummy.up.set(0, 1, 0);
            dummy.lookAt(target);
            // lookAt aligns local -Z to target. We want local X to target.
            dummy.rotateY(Math.PI / 2);

            // Add slight random wobble to simulate vibration/settling
            const wobble = Math.sin(time * 10 + i) * 0.05;
            dummy.rotateX(wobble);

            dummy.updateMatrix();
            instancedFilings.setMatrixAt(i, dummy.matrix);
        }
        
        instancedFilings.instanceMatrix.needsUpdate = true;
    };

    return group;
}
