import * as THREE from 'three';

export function createBerylliumJwstMirror(scene, renderer, camera) {
    const group = new THREE.Group();

    // James Webb Space Telescope uses gold-coated Beryllium mirrors
    // because Be is incredibly stiff and holds its shape at cryogenic temps.

    // Hexagon shape
    const hexRadius = 2.5;
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = hexRadius * Math.cos(angle);
        const hy = hexRadius * Math.sin(angle);
        if (i === 0) shape.moveTo(hx, hy);
        else shape.lineTo(hx, hy);
    }
    shape.closePath();

    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Front is gold, back is raw Be
    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.05, clearcoat: 1.0 });
    const beMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 0.7, roughness: 0.6 });
    
    // Create the 18-segment primary mirror array
    const mirrorGroup = new THREE.Group();
    
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;
    
    const positions = [
        [0,0], // Center (usually empty but we'll include for pattern)
        [0, hexHeight], [0, -hexHeight],
        [hexWidth*0.75, hexHeight*0.5], [hexWidth*0.75, -hexHeight*0.5],
        [-hexWidth*0.75, hexHeight*0.5], [-hexWidth*0.75, -hexHeight*0.5],
        
        // Outer ring
        [0, hexHeight*2], [0, -hexHeight*2],
        [hexWidth*0.75, hexHeight*1.5], [hexWidth*0.75, -hexHeight*1.5],
        [-hexWidth*0.75, hexHeight*1.5], [-hexWidth*0.75, -hexHeight*1.5],
        [hexWidth*1.5, hexHeight], [hexWidth*1.5, -hexHeight],
        [-hexWidth*1.5, hexHeight], [-hexWidth*1.5, -hexHeight],
        [hexWidth*1.5, 0], [-hexWidth*1.5, 0]
    ];
    
    positions.forEach((pos, idx) => {
        if (idx === 0) return; // Skip absolute center for JWST
        
        const mesh = new THREE.Mesh(geometry, [goldMat, beMat]);
        mesh.position.set(pos[0], pos[1], 0);
        
        // Slight curvature
        const dist = Math.sqrt(pos[0]*pos[0] + pos[1]*pos[1]);
        mesh.position.z = dist * dist * -0.02; // Parabolic curve
        
        // Point towards focus
        mesh.lookAt(new THREE.Vector3(0, 0, 15));
        
        mirrorGroup.add(mesh);
    });
    
    group.add(mirrorGroup);

    // Light rays simulating infrared capture
    const rayGeo = new THREE.CylinderGeometry(0.05, 0.05, 20);
    rayGeo.rotateX(Math.PI/2);
    const rayMat = new THREE.MeshBasicMaterial({ color: 0xff4444, transparent: true, opacity: 0.4 });
    
    const rays = new THREE.Group();
    positions.forEach((pos, idx) => {
        if(idx===0) return;
        const ray = new THREE.Mesh(rayGeo, rayMat);
        ray.position.set(pos[0], pos[1], 10);
        rays.add(ray);
    });
    group.add(rays);

    // Animation
    let time = 0;
    return {
        group,
        update: () => {
            time += 0.01;
            mirrorGroup.rotation.y = Math.sin(time * 0.5) * 0.2;
            mirrorGroup.rotation.x = Math.sin(time * 0.3) * 0.2;
            
            // Pulse rays
            rays.children.forEach((r, i) => {
                r.material.opacity = 0.2 + Math.sin(time * 5 + i) * 0.2;
            });
            rays.rotation.copy(mirrorGroup.rotation);
        }
    };
}
