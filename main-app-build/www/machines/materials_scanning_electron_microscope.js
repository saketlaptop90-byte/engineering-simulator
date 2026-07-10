import { materials as sharedMaterials } from '../utils/materials.js';

export function createScanningElectronMicroscope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const materials = sharedMaterials || {
        metal: new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.5, roughness: 0.4 }),
        darkMetal: new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 }),
        screen: new THREE.MeshBasicMaterial({ color: 0x44aa44 }),
        glass: new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.9, opacity: 1, transparent: true })
    };

    // Desk
    const deskGeo = new THREE.BoxGeometry(5, 0.2, 2.5);
    const desk = new THREE.Mesh(deskGeo, materials.metal);
    desk.position.set(-1.5, 1.5, 0);
    group.add(desk);

    // Monitors
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(-1.5, 2.2, -0.5);
    const monitorGeo = new THREE.BoxGeometry(1.2, 0.8, 0.1);
    const screenGeo = new THREE.PlaneGeometry(1.1, 0.7);
    
    for(let i=0; i<2; i++) {
        const mon = new THREE.Mesh(monitorGeo, materials.darkMetal);
        mon.position.set(i * 1.3 - 0.65, 0, 0);
        if(i===0) mon.rotation.y = 0.2;
        if(i===1) mon.rotation.y = -0.2;
        
        const screen = new THREE.Mesh(screenGeo, materials.screen);
        screen.position.set(0, 0, 0.051);
        mon.add(screen);
        monitorGroup.add(mon);
    }
    group.add(monitorGroup);

    // Isolation Table
    const tableGeo = new THREE.BoxGeometry(2, 0.5, 2);
    const table = new THREE.Mesh(tableGeo, materials.darkMetal);
    table.position.set(2, 0.25, 0);
    group.add(table);

    // Chamber
    const chamberGeo = new THREE.BoxGeometry(1.6, 1.2, 1.6);
    const chamber = new THREE.Mesh(chamberGeo, materials.metal);
    chamber.position.set(2, 1.1, 0);
    group.add(chamber);

    // Column
    const columnGeo = new THREE.CylinderGeometry(0.3, 0.5, 2.5, 32);
    const column = new THREE.Mesh(columnGeo, materials.metal);
    column.position.set(2, 2.95, 0);
    group.add(column);

    // Sample Stage (animated sliding out)
    const doorGeo = new THREE.BoxGeometry(1.4, 0.8, 0.1);
    const door = new THREE.Mesh(doorGeo, materials.darkMetal);
    door.position.set(2, 1.1, 0.85);
    group.add(door);

    const stageGeo = new THREE.BoxGeometry(1, 0.1, 1);
    const stage = new THREE.Mesh(stageGeo, materials.metal);
    stage.position.set(0, -0.3, -0.4);
    door.add(stage);

    // Electron Beam (pulse)
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.05, 2.5, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(2, 2.95, 0);
    group.add(beam);

    // Animation
    const times = [0, 2, 3, 5, 6, 8];
    const doorTrack = new THREE.VectorKeyframeTrack(
        door.uuid + '.position',
        times,
        [
            2, 1.1, 0.85,
            2, 1.1, 1.8, // opens
            2, 1.1, 1.8, // wait
            2, 1.1, 0.85, // close
            2, 1.1, 0.85,
            2, 1.1, 0.85
        ]
    );

    const beamOpacityTrack = new THREE.NumberKeyframeTrack(
        beamMat.uuid + '.opacity',
        times,
        [
            0, 0, 0, 0, 0.8, 0
        ]
    );

    const clip = new THREE.AnimationClip('SEM_Operation', 8, [doorTrack, beamOpacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
