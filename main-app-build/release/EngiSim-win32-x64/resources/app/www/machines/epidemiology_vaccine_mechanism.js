export function createVaccineMechanism(THREE) {
    const group = new THREE.Group();

    // The Virus
    const virus = new THREE.Group();
    virus.name = "Virus";
    
    const virusCoreGeo = new THREE.SphereGeometry(1, 16, 16);
    const virusMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, bumpScale: 0.05 });
    const virusCore = new THREE.Mesh(virusCoreGeo, virusMat);
    virus.add(virusCore);

    // Spikes on virus
    const spikeGeo = new THREE.ConeGeometry(0.1, 0.4, 8);
    spikeGeo.translate(0, 0.2, 0);
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xc0392b });
    const spike1 = new THREE.Mesh(spikeGeo, spikeMat);
    spike1.position.set(0, 1, 0);
    virus.add(spike1);
    
    const spike2 = new THREE.Mesh(spikeGeo, spikeMat);
    spike2.position.set(1, 0, 0);
    spike2.rotation.z = -Math.PI / 2;
    virus.add(spike2);

    group.add(virus);

    // The Antibodies (Y-shaped)
    const createAntibody = () => {
        const abGroup = new THREE.Group();
        const abMat = new THREE.MeshStandardMaterial({ color: 0x3498db });
        
        const baseGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
        const base = new THREE.Mesh(baseGeo, abMat);
        base.position.y = -0.25;
        abGroup.add(base);

        const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
        const arm1 = new THREE.Mesh(armGeo, abMat);
        arm1.position.set(-0.15, 0.15, 0);
        arm1.rotation.z = Math.PI / 4;
        abGroup.add(arm1);

        const arm2 = new THREE.Mesh(armGeo, abMat);
        arm2.position.set(0.15, 0.15, 0);
        arm2.rotation.z = -Math.PI / 4;
        abGroup.add(arm2);

        return abGroup;
    };

    const ab1 = createAntibody();
    ab1.name = "Antibody1";
    ab1.position.set(0, 3, 0);
    ab1.rotation.z = Math.PI;
    group.add(ab1);

    const ab2 = createAntibody();
    ab2.name = "Antibody2";
    ab2.position.set(3, 0, 0);
    ab2.rotation.z = Math.PI / 2;
    group.add(ab2);

    // Animation: Antibodies moving towards spikes and attaching
    const times = [0, 2, 4];
    
    const ab1Pos = [0,3,0,  0,1.5,0,  0,1.4,0];
    const ab2Pos = [3,0,0,  1.5,0,0,  1.4,0,0];

    const track1 = new THREE.VectorKeyframeTrack(`${ab1.name}.position`, times, ab1Pos);
    const track2 = new THREE.VectorKeyframeTrack(`${ab2.name}.position`, times, ab2Pos);

    const clip = new THREE.AnimationClip('Neutralization', 4, [track1, track2]);

    return { group, animationClips: [clip] };
}
