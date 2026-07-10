import * as materials from '../utils/materials.js';

export function createOffshoreDerrick(THREE) {
    const group = new THREE.Group();
    group.name = 'OffshoreDrillingDerrick';

    const derrickMat = materials.metalGalvanized || new THREE.MeshStandardMaterial({ color: 0x999999, wireframe: true });
    const redMat = materials.paintedRed || new THREE.MeshStandardMaterial({ color: 0xcc0000 });

    // Derrick tower (Pyramid shape)
    const towerGeo = new THREE.CylinderGeometry(2, 6, 20, 4);
    const tower = new THREE.Mesh(towerGeo, derrickMat);
    tower.position.y = 10;
    tower.rotation.y = Math.PI / 4;
    group.add(tower);

    // Crown Block (Top)
    const crownGeo = new THREE.BoxGeometry(3, 1, 3);
    const crown = new THREE.Mesh(crownGeo, redMat);
    crown.position.y = 20.5;
    group.add(crown);

    // Traveling Block (Moving part)
    const blockGroup = new THREE.Group();
    blockGroup.position.y = 15;
    group.add(blockGroup);

    const travelingGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
    const travelingBlock = new THREE.Mesh(travelingGeo, redMat);
    blockGroup.add(travelingBlock);

    // Drill string
    const drillGeo = new THREE.CylinderGeometry(0.2, 0.2, 15, 8);
    const drillMat = materials.metalSteel || new THREE.MeshStandardMaterial({ color: 0x444444 });
    const drillString = new THREE.Mesh(drillGeo, drillMat);
    drillString.position.y = -7.5;
    blockGroup.add(drillString);

    // Animation: Traveling block moving down and up, drill string rotating
    const duration = 10;
    const times = [0, duration / 2, duration];
    
    const blockValues = [15, 5, 15];
    const blockTrack = new THREE.NumberKeyframeTrack(`${blockGroup.uuid}.position[y]`, times, blockValues);
    
    // Rotation of drill string
    const rotTimes = [0, duration];
    const rotValues = [0, Math.PI * 10];
    const rotTrack = new THREE.NumberKeyframeTrack(`${drillString.uuid}.rotation[y]`, rotTimes, rotValues);

    const clip = new THREE.AnimationClip('DrillCycle', duration, [blockTrack, rotTrack]);

    return { group, animationClips: [clip] };
}
