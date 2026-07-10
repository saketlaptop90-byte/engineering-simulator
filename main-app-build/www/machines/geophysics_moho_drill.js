import { darkSteel, copper, titanium } from '../utils/materials.js';

export function createMohoDrill(THREE) {
    const group = new THREE.Group();
    group.name = "MohoDrill";

    // Base structure
    const baseGeo = new THREE.CylinderGeometry(5, 5, 2, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = 1;
    group.add(base);

    // Support pillars
    for(let i=0; i<4; i++) {
        const pillarGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
        const pillar = new THREE.Mesh(pillarGeo, titanium);
        pillar.position.set(
            Math.cos(i * Math.PI / 2) * 3,
            6,
            Math.sin(i * Math.PI / 2) * 3
        );
        group.add(pillar);
    }

    // Drill shaft
    const shaftGeo = new THREE.CylinderGeometry(1, 1, 15, 16);
    const shaft = new THREE.Mesh(shaftGeo, copper);
    shaft.position.y = 7.5;
    
    // Drill bit
    const bitGeo = new THREE.ConeGeometry(1.5, 4, 16);
    const bit = new THREE.Mesh(bitGeo, darkSteel);
    bit.position.y = -9.5;
    bit.rotation.x = Math.PI; // point downwards
    shaft.add(bit);
    
    group.add(shaft);

    // Animation: Shaft spinning and moving up/down
    const times = [0, 2];
    const values = [0, Math.PI * 4];

    const shaftTrack = new THREE.NumberKeyframeTrack(
        `${shaft.uuid}.rotation[y]`,
        times,
        values
    );

    const yValues = [7.5, 6.5, 7.5];
    const yTimes = [0, 1, 2];
    const shaftYTrack = new THREE.NumberKeyframeTrack(
        `${shaft.uuid}.position[y]`,
        yTimes,
        yValues
    );

    const clip = new THREE.AnimationClip("DrillAction", 2, [shaftTrack, shaftYTrack]);

    return { group, animationClips: [clip] };
}
