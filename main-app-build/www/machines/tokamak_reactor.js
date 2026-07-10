import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Torus Vacuum Vessel ---
    const vesselGeo = new THREE.TorusGeometry(3, 1, 32, 64, Math.PI * 1.5); // 3/4 cutaway to see inside
    const vesselMat = new THREE.MeshStandardMaterial({ 
        color: 0x555555, 
        metalness: 0.8, 
        roughness: 0.4,
        side: THREE.DoubleSide
    });
    const vessel = new THREE.Mesh(vesselGeo, vesselMat);
    vessel.rotation.x = Math.PI / 2;
    vessel.userData = { id: 'tokamak_vessel', name: 'Vacuum Vessel', description: 'A massive donut-shaped chamber maintained at an extreme vacuum. Deuterium and Tritium gases are injected here.' };
    group.add(vessel);

    // --- 2. Magnetic Coils (Toroidal Field) ---
    // These wrap around the torus
    const coilCount = 18;
    const coilGeo = new THREE.TorusGeometry(1.2, 0.1, 16, 32);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 1.0, roughness: 0.2 }); // Copper
    
    for (let i = 0; i < coilCount; i++) {
        const coil = new THREE.Mesh(coilGeo, coilMat);
        const angle = (i / coilCount) * Math.PI * 2;
        
        // Don't draw coils in the cutaway section
        if (angle > Math.PI * 1.5) continue;
        
        // Position along the major radius
        coil.position.set(Math.cos(angle) * 3, 0, Math.sin(angle) * 3);
        // Rotate to face tangentially
        coil.rotation.y = -angle;
        group.add(coil);
    }

    // --- 3. The Plasma (Fusion) ---
    // We will represent the superheated plasma with a glowing inner torus and swirling particles
    const plasmaGeo = new THREE.TorusGeometry(3, 0.4, 16, 64);
    const plasmaMat = new THREE.MeshBasicMaterial({ 
        color: 0xff00ff, // Purple/pink plasma glow
        transparent: true, 
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const plasmaCore = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasmaCore.rotation.x = Math.PI / 2;
    plasmaCore.userData = { id: 'fusion_plasma', name: 'Confined Plasma', description: 'Heated to 150 million degrees Celsius (10x hotter than the sun). The incredibly strong magnetic fields force the plasma into a tight ring so it never touches the walls.' };
    group.add(plasmaCore);

    // Plasma Particles (Swirling around the torus)
    const pCount = 500;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pData = [];

    for (let i = 0; i < pCount; i++) {
        pData.push({
            majorAngle: Math.random() * Math.PI * 2,
            minorAngle: Math.random() * Math.PI * 2,
            radius: Math.random() * 0.4 // Minor radius within the plasma core
        });
        pPos[i*3] = 0; pPos[i*3+1] = 0; pPos[i*3+2] = 0; // Set in animate
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ 
        color: 0x00ffff, 
        size: 0.1, 
        transparent: true, 
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const plasmaParticles = new THREE.Points(pGeo, pMat);
    group.add(plasmaParticles);

    // --- 4. Central Solenoid (Inner core) ---
    const solenoidGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const solenoidMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 });
    const solenoid = new THREE.Mesh(solenoidGeo, solenoidMat);
    solenoid.userData = { id: 'central_solenoid', name: 'Central Solenoid', description: 'Acts as a massive transformer, inducing a massive electrical current IN the plasma itself to heat it and create the poloidal magnetic field.' };
    group.add(solenoid);

    // --- 5. Animation ---
    group.userData.animate = function(delta) {
        // Make plasma throb slightly
        const time = Date.now() * 0.005;
        const scale = 1.0 + Math.sin(time) * 0.05;
        plasmaCore.scale.set(1, 1, scale); // Scale the minor radius visually

        // Swirl particles (Helical path: moving along major radius AND minor radius)
        const pos = plasmaParticles.geometry.attributes.position.array;
        
        for (let i = 0; i < pCount; i++) {
            const data = pData[i];
            
            // Move around the donut (Toroidal flow)
            data.majorAngle += delta * 2.0; 
            // Swirl around the minor axis (Poloidal flow)
            data.minorAngle += delta * 5.0; 
            
            // Calculate 3D position of a point on a torus
            const R = 3; // Major radius
            const r = data.radius; // Minor radius
            
            // X and Z form the main circle, Y is up
            // To form the tube, we offset from the main circle by r*cos/sin
            const tx = (R + r * Math.cos(data.minorAngle)) * Math.cos(data.majorAngle);
            const ty = r * Math.sin(data.minorAngle);
            const tz = (R + r * Math.cos(data.minorAngle)) * Math.sin(data.majorAngle);
            
            pos[i*3] = tx;
            pos[i*3+1] = ty;
            pos[i*3+2] = tz;
        }
        
        plasmaParticles.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}

// Auto-generated missing stub
export function createTokamakReactor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
