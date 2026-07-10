export function createChromatinRemodeling(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Nucleosomes
    const nucleosomeMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const nucleosomeGeo = new THREE.SphereGeometry(2, 32, 32);

    const nucleosome1 = new THREE.Mesh(nucleosomeGeo, nucleosomeMaterial);
    nucleosome1.name = "nucleosome1";
    nucleosome1.position.set(-5, 0, 0);
    group.add(nucleosome1);

    const nucleosome2 = new THREE.Mesh(nucleosomeGeo, nucleosomeMaterial);
    nucleosome2.name = "nucleosome2";
    nucleosome2.position.set(5, 0, 0);
    group.add(nucleosome2);

    // Remodeling complex
    const complexGeo = new THREE.TorusKnotGeometry(1.5, 0.4, 64, 8);
    const complexMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const complex = new THREE.Mesh(complexGeo, complexMat);
    complex.position.set(0, 3, 0);
    group.add(complex);

    // Animation: pushing nucleosomes apart
    const times = [0, 1, 2];
    const pos1 = [-5, 0, 0, -8, 0, 0, -5, 0, 0];
    const pos2 = [5, 0, 0, 8, 0, 0, 5, 0, 0];
    
    const track1 = new THREE.VectorKeyframeTrack('nucleosome1.position', times, pos1);
    const track2 = new THREE.VectorKeyframeTrack('nucleosome2.position', times, pos2);
    const clip = new THREE.AnimationClip('RemodelAction', 2, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
