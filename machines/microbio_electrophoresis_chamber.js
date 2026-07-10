import * as sharedMaterials from '../utils/materials.js';

export function createElectrophoresisChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const glassMat = sharedMaterials.glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.5 });
    const liquidMat = sharedMaterials.liquidMaterial || new THREE.MeshPhysicalMaterial({ color: 0xaaaaff, transmission: 0.8, transparent: true, opacity: 0.7 });
    const gelMat = sharedMaterials.gelMaterial || new THREE.MeshPhysicalMaterial({ color: 0xeef5ff, transmission: 0.6, transparent: true });
    const bandMat = sharedMaterials.accentMaterial || new THREE.MeshBasicMaterial({ color: 0xaa00aa });

    // Tank
    const tankGeo = new THREE.BoxGeometry(3, 1, 1.5);
    const tank = new THREE.Mesh(tankGeo, glassMat);
    tank.position.set(0, 0.5, 0);
    group.add(tank);

    // Buffer Liquid
    const liquidGeo = new THREE.BoxGeometry(2.9, 0.6, 1.4);
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.set(0, 0.35, 0);
    group.add(liquid);

    // Gel
    const gelGeo = new THREE.BoxGeometry(2, 0.1, 1);
    const gel = new THREE.Mesh(gelGeo, gelMat);
    gel.position.set(0, 0.3, 0);
    group.add(gel);

    // DNA Bands
    const band1Group = new THREE.Group();
    band1Group.name = "DNABand1";
    band1Group.position.set(-0.8, 0.36, 0.2);
    const bandGeo = new THREE.BoxGeometry(0.05, 0.02, 0.2);
    const band1 = new THREE.Mesh(bandGeo, bandMat);
    band1Group.add(band1);
    group.add(band1Group);

    const band2Group = new THREE.Group();
    band2Group.name = "DNABand2";
    band2Group.position.set(-0.8, 0.36, -0.2);
    const band2 = new THREE.Mesh(bandGeo, bandMat);
    band2Group.add(band2);
    group.add(band2Group);

    // Electrodes
    const electrodeGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2);
    electrodeGeo.rotateX(Math.PI / 2);
    
    const anode = new THREE.Mesh(electrodeGeo, new THREE.MeshBasicMaterial({color: 0xff0000}));
    anode.position.set(1.3, 0.2, 0);
    group.add(anode);

    const cathode = new THREE.Mesh(electrodeGeo, new THREE.MeshBasicMaterial({color: 0x000000}));
    cathode.position.set(-1.3, 0.2, 0);
    group.add(cathode);

    // Animation: Bands migrating
    const times = [0, 5];
    const b1Values = [
        -0.8, 0.36, 0.2,
        0.5, 0.36, 0.2
    ];
    const b2Values = [
        -0.8, 0.36, -0.2,
        0.8, 0.36, -0.2
    ];

    const band1Track = new THREE.VectorKeyframeTrack('DNABand1.position', times, b1Values);
    const band2Track = new THREE.VectorKeyframeTrack('DNABand2.position', times, b2Values);

    const clip = new THREE.AnimationClip('ElectrophoresisRun', 5, [band1Track, band2Track]);
    animationClips.push(clip);

    return { group, animationClips };
}
