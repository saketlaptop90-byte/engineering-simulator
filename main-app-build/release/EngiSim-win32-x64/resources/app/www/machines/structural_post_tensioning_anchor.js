import * as materials from '../utils/materials.js';

export function createPostTensioningAnchor(THREE) {
    const group = new THREE.Group();
    group.name = "PostTensioningAnchor";

    const concreteMat = materials.concrete || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 });
    const steelMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.8, roughness: 0.3 });
    const brassMat = materials.accent || new THREE.MeshStandardMaterial({ color: 0xbbaaaa, metalness: 0.9, roughness: 0.4 });

    // Concrete block representation
    const blockGeo = new THREE.BoxGeometry(4, 4, 2);
    const block = new THREE.Mesh(blockGeo, concreteMat);
    block.position.z = -1;
    group.add(block);

    // Anchor head plate
    const plateGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32);
    plateGeo.rotateX(Math.PI / 2);
    const plate = new THREE.Mesh(plateGeo, steelMat);
    plate.position.z = 0.15;
    group.add(plate);

    // Tendon cable
    const tendonGroup = new THREE.Group();
    const tendonGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    tendonGeo.rotateX(Math.PI / 2);
    const tendon = new THREE.Mesh(tendonGeo, steelMat);
    tendon.position.z = -2; // Extends into the block
    tendonGroup.add(tendon);
    group.add(tendonGroup);

    // Locking Wedges
    const wedgeGroup = new THREE.Group();
    wedgeGroup.position.z = 0.4;
    
    for (let i = 0; i < 3; i++) {
        const wedgeGeo = new THREE.ConeGeometry(0.18, 0.6, 16);
        wedgeGeo.rotateX(-Math.PI / 2);
        wedgeGeo.translate(0, 0.12, 0); // Offset outwards
        const wedge = new THREE.Mesh(wedgeGeo, brassMat);
        
        const angle = (i * Math.PI * 2) / 3;
        wedge.rotation.z = angle;
        wedgeGroup.add(wedge);
    }
    group.add(wedgeGroup);

    // Animation: Tensioning the tendon and seating the wedges
    const times = [0, 2, 3, 4, 5];
    
    // Tendon pull sequence
    const tendonZ = [
        0, 0, 0,
        0, 0, 0.6, // Cable is pulled out
        0, 0, 0.6, // Hold tension
        0, 0, 0.5, // Release slightly against wedges
        0, 0, 0.5  // Rest
    ];
    const tendonTrack = new THREE.VectorKeyframeTrack(tendonGroup.uuid + '.position', times, tendonZ);

    // Wedges sliding in
    const wedgeZ = [
        0, 0, 0.4, // Loose position
        0, 0, 0.4, // Wait for pull
        0, 0, 0.1, // Slide into anchor
        0, 0, 0.1, // Hold
        0, 0, 0.1  // Final lock
    ];
    const wedgeTrack = new THREE.VectorKeyframeTrack(wedgeGroup.uuid + '.position', times, wedgeZ);

    const clip = new THREE.AnimationClip('Tensioning', 5, [tendonTrack, wedgeTrack]);

    return { group, animationClips: [clip] };
}
