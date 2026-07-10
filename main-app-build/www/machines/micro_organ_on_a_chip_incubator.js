import { glass, gold, copper, aluminum } from '../utils/materials.js';

export function createOrganOnAChip(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Incubator Housing
    const housingGeom = new THREE.BoxGeometry(14, 8, 10);
    const housingMat = aluminum.clone();
    housingMat.transparent = true;
    housingMat.opacity = 0.2;
    const housing = new THREE.Mesh(housingGeom, housingMat);
    group.add(housing);

    // Chip Holder
    const holderGeom = new THREE.BoxGeometry(8, 0.5, 6);
    const holder = new THREE.Mesh(holderGeom, copper);
    holder.position.y = -2;
    group.add(holder);

    // The Chip itself
    const chipGeom = new THREE.BoxGeometry(6, 0.2, 4);
    const chip = new THREE.Mesh(chipGeom, glass);
    chip.position.y = -1.6;
    group.add(chip);

    // Tissue cultures (spheres representing organoids)
    const organoidGroup = new THREE.Group();
    organoidGroup.name = "organoids";
    organoidGroup.position.y = -1.4;
    group.add(organoidGroup);

    const orgGeom = new THREE.DodecahedronGeometry(0.3, 1);
    const orgMat = new THREE.MeshStandardMaterial({ color: 0xffaaaa, roughness: 0.6 });
    for(let i=0; i<3; i++) {
        for(let j=0; j<2; j++) {
            const org = new THREE.Mesh(orgGeom, orgMat);
            org.position.set(-2 + i*2, 0, -1 + j*2);
            org.name = `organoid_${i}_${j}`;
            organoidGroup.add(org);
        }
    }

    // Perfusion Tubes
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, transparent: true, opacity: 0.5 });
    const tubeGeom = new THREE.CylinderGeometry(0.1, 0.1, 8);
    const tube1 = new THREE.Mesh(tubeGeom, tubeMat);
    tube1.position.set(-4, 2, 0);
    group.add(tube1);

    const tube2 = new THREE.Mesh(tubeGeom, tubeMat);
    tube2.position.set(4, 2, 0);
    group.add(tube2);

    // Animation: organoid pulsation / breathing
    const tracks = [];
    organoidGroup.children.forEach((org, i) => {
        const times = [0, 1, 2, 3, 4];
        const baseScale = 1;
        const maxScale = 1.2 + (Math.random() * 0.1);
        const values = [
            baseScale, baseScale, baseScale,
            maxScale, maxScale, maxScale,
            baseScale, baseScale, baseScale,
            maxScale, maxScale, maxScale,
            baseScale, baseScale, baseScale
        ];
        tracks.push(new THREE.VectorKeyframeTrack(`${organoidGroup.name}/${org.name}.scale`, times, values));
    });

    const clip = new THREE.AnimationClip('Breathing_Perfusion', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
