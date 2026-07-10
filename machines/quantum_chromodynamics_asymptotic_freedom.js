export function createAsymptoticFreedom(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const quarkMat = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0x882200, roughness: 0.3 });
    const q1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), quarkMat);
    q1.name = 'Quark1';
    const q2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), quarkMat);
    q2.name = 'Quark2';
    
    group.add(q1, q2);

    const couplingMat = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, 
        transparent: true, 
        opacity: 0.5, 
        emissive: 0xcc0000,
        wireframe: true
    });
    const couplingVolume = new THREE.Mesh(new THREE.SphereGeometry(2, 64, 64), couplingMat);
    couplingVolume.name = 'CouplingVolume';
    group.add(couplingVolume);

    // Asymptotic freedom core (weak coupling at short distances)
    const innerCore = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        emissive: 0xffffff
    }));
    innerCore.name = 'InnerCore';
    group.add(innerCore);

    const times = [0, 3, 6, 9];
    const q1Pos = [-1, 0, 0,  -6, 0, 0,  -1, 0, 0,  -6, 0, 0];
    const q2Pos = [1, 0, 0,   6, 0, 0,   1, 0, 0,   6, 0, 0];
    
    const q1Track = new THREE.VectorKeyframeTrack('Quark1.position', times, q1Pos);
    const q2Track = new THREE.VectorKeyframeTrack('Quark2.position', times, q2Pos);

    const scale = [1,1,1,  4,4,4,  1,1,1,  4,4,4];
    const scaleTrack = new THREE.VectorKeyframeTrack('CouplingVolume.scale', times, scale);
    
    couplingVolume.material.name = 'CouplingMaterial';
    const opacityTrack = new THREE.NumberKeyframeTrack('CouplingVolume.material.opacity', times, [0.1, 1.0, 0.1, 1.0]);

    const innerScale = [1,1,1, 0.1,0.1,0.1, 1,1,1, 0.1,0.1,0.1];
    const innerScaleTrack = new THREE.VectorKeyframeTrack('InnerCore.scale', times, innerScale);

    const clip = new THREE.AnimationClip('CouplingScaling', 9, [q1Track, q2Track, scaleTrack, opacityTrack, innerScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
