import * as Materials from '../utils/materials.js';

export function createMicrowaveRelay(THREE) {
    const group = new THREE.Group();
    group.name = "Microwave_Relay";

    // Equipment Hut
    const hutGeo = new THREE.BoxGeometry(3, 2.5, 3);
    const hut = new THREE.Mesh(hutGeo, Materials.whitePlastic);
    hut.position.set(0, 1.25, 0);
    group.add(hut);

    // Lattice Tower
    const towerGeo = new THREE.CylinderGeometry(0.8, 1.5, 15, 4);
    const tower = new THREE.Mesh(towerGeo, Materials.ghostMaterial.clone());
    tower.material.opacity = 0.2;
    tower.position.set(0, 10, 0);
    group.add(tower);
    
    // Lattice edges for visual detail
    const edges = new THREE.EdgesGeometry(towerGeo);
    const lattice = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x333333 }));
    lattice.position.set(0, 10, 0);
    group.add(lattice);

    // Microwave Drum Dishes
    const drumGeo = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const radomeGeo = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.25);

    // Dish 1
    const dishGroup1 = new THREE.Group();
    dishGroup1.name = "Dish1";
    dishGroup1.position.set(0, 16, 0.8);
    group.add(dishGroup1);

    const drum = new THREE.Mesh(drumGeo, Materials.aluminum);
    drum.rotation.x = Math.PI / 2;
    dishGroup1.add(drum);

    const radome = new THREE.Mesh(radomeGeo, Materials.whitePlastic);
    radome.rotation.x = Math.PI / 2;
    radome.position.z = 0.25;
    dishGroup1.add(radome);

    // Dish 2
    const dishGroup2 = new THREE.Group();
    dishGroup2.name = "Dish2";
    dishGroup2.position.set(0, 14, -0.8);
    dishGroup2.rotation.y = Math.PI; // Face opposite direction
    group.add(dishGroup2);

    const drum2 = new THREE.Mesh(drumGeo, Materials.aluminum);
    drum2.rotation.x = Math.PI / 2;
    dishGroup2.add(drum2);
    
    const radome2 = new THREE.Mesh(radomeGeo, Materials.whitePlastic);
    radome2.rotation.x = Math.PI / 2;
    radome2.position.z = 0.25;
    dishGroup2.add(radome2);

    // Invisible Microwave Beam (Visualized)
    const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.3, additiveBlending: THREE.AdditiveBlending });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.x = Math.PI / 2;
    beam.position.z = 5.25;
    beam.name = "MicroBeam";
    dishGroup1.add(beam);

    // Animations
    const duration = 6;
    const tracks = [];

    // Subtle Dish Panning
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.2, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.2, 0));

    tracks.push(new THREE.QuaternionKeyframeTrack("Dish1.quaternion", [0, 1.5, 4.5, 6], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q1.x, q1.y, q1.z, q1.w
    ]));

    // Pulsing Microwave Beam
    const bTimes = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0];
    const bVals = [];
    for (let i = 0; i < bTimes.length; i++) bVals.push(i % 2 === 0 ? 0.4 : 0.0);
    tracks.push(new THREE.NumberKeyframeTrack("MicroBeam.material.opacity", bTimes, bVals));

    const clip = new THREE.AnimationClip("RelayActive", duration, tracks);

    return { group, animationClips: [clip] };
}
