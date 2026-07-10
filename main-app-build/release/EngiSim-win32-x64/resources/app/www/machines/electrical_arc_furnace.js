import { materials } from '../utils/materials.js';

export function createArcFurnace(THREE) {
    const group = new THREE.Group();

    const matFurnace = materials?.metalDark || new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.5 });
    const matElectrode = materials?.graphite || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
    const matMelt = materials?.lava || new THREE.MeshBasicMaterial({ color: 0xff5500 });
    const matArc = materials?.arc || new THREE.MeshBasicMaterial({ color: 0xaaaaff, transparent: true, opacity: 0.9 });

    // Furnace Bowl
    const bowlGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bowl = new THREE.Mesh(bowlGeo, matFurnace);
    group.add(bowl);

    // Melted metal pool inside
    const meltGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.1, 32);
    const melt = new THREE.Mesh(meltGeo, matMelt);
    melt.position.y = -0.5;
    group.add(melt);

    // Electrodes Group (3-phase)
    const electrodesGroup = new THREE.Group();
    electrodesGroup.name = "electrodesGroup";
    
    const arcGroup = new THREE.Group();
    arcGroup.name = "arcGroup";
    
    for (let i = 0; i < 3; i++) {
        // Electrode
        const elGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
        const electrode = new THREE.Mesh(elGeo, matElectrode);
        const angle = (i / 3) * Math.PI * 2;
        const radius = 1.0;
        electrode.position.x = Math.sin(angle) * radius;
        electrode.position.z = Math.cos(angle) * radius;
        electrode.position.y = 2.5; // Will animate up and down
        electrodesGroup.add(electrode);

        // Arc connecting electrode to melt
        const arcGeo = new THREE.CylinderGeometry(0.1, 0.15, 1.5, 8);
        const arc = new THREE.Mesh(arcGeo, matArc);
        arc.position.x = Math.sin(angle) * radius;
        arc.position.z = Math.cos(angle) * radius;
        arc.position.y = 0.2; 
        arcGroup.add(arc);
    }
    
    group.add(electrodesGroup);
    group.add(arcGroup);

    // Roof structure
    const roofGeo = new THREE.CylinderGeometry(2.5, 3.2, 0.5, 32);
    const roof = new THREE.Mesh(roofGeo, matFurnace);
    roof.position.y = 1.5;
    group.add(roof);

    // Animations: Electrodes lowering, arcs flashing
    const times = [0, 1, 2, 3, 4];
    const elPosValues = [
        0, 3, 0,
        0, 1.5, 0,
        0, 1.5, 0,
        0, 3, 0,
        0, 3, 0
    ];
    const elTrack = new THREE.VectorKeyframeTrack('electrodesGroup.position', times, elPosValues);

    // Arc scaling to simulate flashing and matching electrode position
    const arcTimes = [0, 1, 1.2, 1.4, 1.6, 1.8, 2.0, 3, 4];
    const arcScaleValues = [
        0,0,0,
        1,1,1,
        1.5,1,1.5,
        0.8,1,0.8,
        1.2,1,1.2,
        0.9,1,0.9,
        1,1,1,
        0,0,0,
        0,0,0
    ];
    const arcTrack = new THREE.VectorKeyframeTrack('arcGroup.scale', arcTimes, arcScaleValues);

    const clip = new THREE.AnimationClip('SmeltAction', 4, [elTrack, arcTrack]);

    return { group, animationClips: [clip] };
}
