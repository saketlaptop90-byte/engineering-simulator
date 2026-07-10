export function createIceCoreDrill(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.25;
    group.add(base);

    // Tower
    const towerGeo = new THREE.CylinderGeometry(0.3, 0.4, 8, 16);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.1 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 4.5;
    group.add(tower);

    // Drill Bit
    const drillGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const drillMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.4 });
    const drill = new THREE.Mesh(drillGeo, drillMat);
    drill.position.y = 2;
    group.add(drill);

    // Animation: Drill rotating and moving down
    const drillTrackName = drill.uuid + '.rotation[y]';
    const drillPosTrackName = drill.uuid + '.position[y]';
    const times = [0, 2, 4];
    const valuesRot = [0, Math.PI * 4, Math.PI * 8];
    const valuesPos = [2, 0.5, 2];

    const rotTrack = new THREE.NumberKeyframeTrack(drillTrackName, times, valuesRot);
    const posTrack = new THREE.NumberKeyframeTrack(drillPosTrackName, times, valuesPos);

    const clip = new THREE.AnimationClip('DrillAction', 4, [rotTrack, posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
