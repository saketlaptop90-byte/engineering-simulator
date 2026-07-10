export function createSyntheticCell(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const membraneMat = new THREE.MeshStandardMaterial({ color: 0x1abc9c, transparent: true, opacity: 0.3, roughness: 0.2 });
    const organelleMat = new THREE.MeshStandardMaterial({ color: 0xd35400 });
    const chromoMat = new THREE.MeshStandardMaterial({ color: 0x2980b9 });

    const cellGeo = new THREE.SphereGeometry(4, 32, 32);
    const cell = new THREE.Mesh(cellGeo, membraneMat);
    cell.name = 'Membrane';
    group.add(cell);

    const organelleGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const organelle = new THREE.Mesh(organelleGeo, organelleMat);
    organelle.position.set(2, 1, -1);
    organelle.name = 'Organelle';
    group.add(organelle);

    const chromoGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
    const chromo = new THREE.Mesh(chromoGeo, chromoMat);
    chromo.name = 'Chromosome';
    group.add(chromo);

    // Animations
    const oTimes = [0, 2, 4];
    const oPos = [
        2, 1, -1,
        1, -1, 1,
        2, 1, -1
    ];
    const organelleTrack = new THREE.VectorKeyframeTrack('Organelle.position', oTimes, oPos);

    const cTimes = [0, 2, 4];
    const cRot1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const cRot2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/4, Math.PI/4, 0));
    const cRot3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const cRot = [...cRot1.toArray(), ...cRot2.toArray(), ...cRot3.toArray()];
    const chromoTrack = new THREE.QuaternionKeyframeTrack('Chromosome.quaternion', cTimes, cRot);

    const clip = new THREE.AnimationClip('CellLife', 4, [organelleTrack, chromoTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
