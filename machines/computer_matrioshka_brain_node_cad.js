import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const innerShellMat = new THREE.MeshPhysicalMaterial({ color: 0xffddaa, metalness: 0.9, roughness: 0.1, clearcoat: 1.0 }); // High-temp crystalline logic
    const midShellMat = new THREE.MeshPhysicalMaterial({ color: 0x88aabb, metalness: 0.7, roughness: 0.3 }); // Superconducting processing mesh
    const outerShellMat = new THREE.MeshPhysicalMaterial({ color: 0x222233, metalness: 0.5, roughness: 0.8 }); // Cryogenic memory storage
    const supportStrutMat = new THREE.MeshPhysicalMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.5 }); // Carbon nanotube pillars
    
    // VFX Materials
    const starCoreVFX = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // The captured star
    const dataLinkVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Photonic data transfer between shells
    const wasteHeatVFX = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Infrared radiation dumping

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.shells = [];
    group.userData.animatedMeshes.dataLinks = [];
    group.userData.animatedMeshes.starCore = null;
    group.userData.animatedMeshes.radiators = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Captured Star & Inner Shell
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // The Star Core (Power Source)
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), starCoreVFX);
    coreGroup.add(star);
    group.userData.animatedMeshes.starCore = star;
    
    // Inner Shell (High-temp logic, runs at thousands of degrees)
    // Modeled as an Icosahedron with gaps
    const innerGeo = new THREE.IcosahedronGeometry(0.6, 2);
    const innerShell = new THREE.Mesh(innerGeo, innerShellMat);
    // Convert to wireframe-like structure for visibility
    const innerWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(innerGeo),
        new THREE.LineBasicMaterial({ color: 0xffddaa })
    );
    // Actually, we'll use a solid mesh with cutouts (simulated by scaled down faces, but for performance, we'll use a slightly transparent material or just wireframe)
    // Let's use the wireframe to represent the massive lattice of computronium
    coreGroup.add(innerWire);
    group.userData.animatedMeshes.shells.push(innerWire);
    
    group.add(coreGroup);
    parts.push({ mesh: innerWire, name: "Inner Computronium Shell", description: "High-temperature crystalline logic lattice.", function: "Absorbs the raw energy of the captured star to power exa-scale computational processes, operating at near-stellar temperatures."});

    // ==========================================
    // 2. PROCEDURAL CAD: Mid & Outer Shells
    // ==========================================
    const outerGroup = new THREE.Group();
    
    // Mid Shell (Superconducting logic)
    const midGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const midWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(midGeo),
        new THREE.LineBasicMaterial({ color: 0x88aabb })
    );
    outerGroup.add(midWire);
    group.userData.animatedMeshes.shells.push(midWire);
    
    // Outer Shell (Cryogenic memory)
    const outGeo = new THREE.IcosahedronGeometry(2.0, 3);
    const outWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(outGeo),
        new THREE.LineBasicMaterial({ color: 0x444455 })
    );
    outerGroup.add(outWire);
    group.userData.animatedMeshes.shells.push(outWire);
    
    // Support Struts connecting the shells
    for(let i=0; i<12; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / 12);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        
        const x = Math.cos(theta) * Math.sin(phi);
        const y = Math.cos(phi);
        const z = Math.sin(theta) * Math.sin(phi);
        
        // Physical strut
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.0).rotateX(Math.PI/2), supportStrutMat);
        strut.position.set(x, y, z);
        strut.lookAt(0,0,0);
        outerGroup.add(strut);
        
        // Photonic Data Link (runs alongside the strut)
        const link = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0).rotateX(Math.PI/2), dataLinkVFX);
        link.position.set(x, y, z);
        link.lookAt(0,0,0);
        outerGroup.add(link);
        group.userData.animatedMeshes.dataLinks.push(link);
        
        // Waste Heat Radiator (pointing outward from the outer shell)
        const rad = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 4).rotateX(-Math.PI/2), wasteHeatVFX);
        rad.position.set(x*2.1, y*2.1, z*2.1);
        rad.lookAt(0,0,0);
        outerGroup.add(rad);
        group.userData.animatedMeshes.radiators.push(rad);
    }
    
    group.add(outerGroup);
    parts.push({ mesh: outWire, name: "Nested Computational Shells (Matrioshka)", description: "Dyson spheres nested like Russian dolls.", function: "Each successive outer shell runs on the waste heat of the shell inside it, maximizing thermodynamic efficiency for planetary-scale computing."});

    // Scale adjustment
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Star Core burns intensely
            group.userData.animatedMeshes.starCore.material.opacity = 0.8 + (Math.sin(timeAcc * 20 * speed) * 0.2);
            group.userData.animatedMeshes.starCore.scale.set(1.0 + (Math.sin(timeAcc * 5 * speed) * 0.05), 1.0 + (Math.cos(timeAcc * 6 * speed) * 0.05), 1.0 + (Math.sin(timeAcc * 7 * speed) * 0.05));
            
            // 2. Shells counter-rotate slowly
            group.userData.animatedMeshes.shells[0].rotation.y += 0.5 * speed * 0.016;
            group.userData.animatedMeshes.shells[1].rotation.x -= 0.3 * speed * 0.016;
            group.userData.animatedMeshes.shells[2].rotation.z += 0.1 * speed * 0.016;
            
            // 3. Photonic Data Links pulse with information transfer
            group.userData.animatedMeshes.dataLinks.forEach((link, index) => {
                // Throbbing pulse that travels down the link
                link.material.opacity = 0.3 + (Math.sin(timeAcc * 15 * speed + index) * 0.7);
            });
            
            // 4. Waste Heat Radiators glow infrared
            group.userData.animatedMeshes.radiators.forEach((rad, index) => {
                rad.material.opacity = 0.4 + (Math.cos(timeAcc * 5 * speed + index) * 0.4);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.starCore.material.opacity = 0.2;
            group.userData.animatedMeshes.starCore.scale.set(1,1,1);
            group.userData.animatedMeshes.dataLinks.forEach(l => l.material.opacity = 0);
            group.userData.animatedMeshes.radiators.forEach(r => r.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
