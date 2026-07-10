import { steel, iron, wood, redAccent, blackPlastic } from '../utils/materials.js';

export function createThicknessPlaner(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Stand
    const stand = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 1.5), iron);
    stand.position.set(0, 0.75, 0);
    group.add(stand);

    // Bed (where wood goes)
    const bed = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 3), steel);
    bed.position.set(0, 1.55, 0);
    group.add(bed);

    // Four Columns
    const colGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2);
    for(let x of [-0.9, 0.9]) {
        for(let z of [-0.6, 0.6]) {
            const col = new THREE.Mesh(colGeo, steel);
            col.position.set(x, 2.1, z);
            group.add(col);
        }
    }

    // Top Housing
    const housingGroup = new THREE.Group();
    housingGroup.position.set(0, 2.4, 0);
    
    const housing = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.6, 1.5), redAccent);
    housingGroup.add(housing);

    // Dust Port
    const dustPort = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3), blackPlastic);
    dustPort.position.set(0, 0.4, 0);
    housingGroup.add(dustPort);

    group.add(housingGroup);

    // Wood Plank
    const plankGroup = new THREE.Group();
    plankGroup.name = "planerPlank";
    
    const plank = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 4), wood);
    plank.position.set(0, 1.7, 2);
    plankGroup.add(plank);

    group.add(plankGroup);

    // Wood Chips
    const chipsGroup = new THREE.Group();
    chipsGroup.name = "planerChips";
    chipsGroup.position.set(0, 2.0, -1);
    
    for(let i=0; i<8; i++) {
        const chip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), wood);
        chip.position.set((Math.random()-0.5)*1.5, (Math.random())*0.5, (Math.random()-0.5)*0.5);
        chipsGroup.add(chip);
    }
    group.add(chipsGroup);

    // Animation: Plank moving
    const posTimes = [0, 2, 4];
    const posValues = [
        0, 1.7, 3,
        0, 1.7, 0,
        0, 1.7, -3
    ];
    const posTrack = new THREE.VectorKeyframeTrack(
        `${plankGroup.name}.position`,
        posTimes,
        posValues
    );

    // Rotate chips randomly
    const chipTimes = [];
    const chipValues = [];
    for(let i=0; i<=40; i++) {
        chipTimes.push(i*0.1);
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI));
        chipValues.push(q.x, q.y, q.z, q.w);
    }
    const chipTrack = new THREE.QuaternionKeyframeTrack(
        `${chipsGroup.name}.quaternion`,
        chipTimes,
        chipValues
    );

    const clip = new THREE.AnimationClip('ThicknessPlanerAction', 4, [posTrack, chipTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
