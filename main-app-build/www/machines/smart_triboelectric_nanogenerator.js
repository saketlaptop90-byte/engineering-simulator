import { glass, titanium, copper } from '../utils/materials.js';

export function createTriboelectricNanogenerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Bottom plate (Titanium electrode)
    const bottomGeo = new THREE.BoxGeometry(3, 0.1, 3);
    const bottomPlate = new THREE.Mesh(bottomGeo, titanium);
    bottomPlate.position.y = -0.5;
    group.add(bottomPlate);

    // Top plate (Polymer with Copper electrode)
    const topGeo = new THREE.BoxGeometry(3, 0.1, 3);
    const topPlate = new THREE.Mesh(topGeo, copper);
    topPlate.name = 'TopPlate';
    topPlate.position.y = 0.5;
    group.add(topPlate);

    // Sparks (Representing generated charge/electricity)
    const sparkGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const sparkMat = copper.clone(); // use existing materials
    sparkMat.name = 'SparkMaterial';
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.name = 'Spark';
    spark.scale.set(0, 0, 0); // Hidden initially
    group.add(spark);

    // Animation: Plates pressing together and sparking
    const times = [0, 0.5, 1, 1.5, 2];
    const topPos = [
        0, 0.5, 0, 
        0, -0.4, 0, 
        0, 0.5, 0,
        0, -0.4, 0,
        0, 0.5, 0
    ];
    const topTrack = new THREE.VectorKeyframeTrack(`TopPlate.position`, times, topPos);

    // Spark size increasing when plates are close
    const sparkScales = [
        0, 0, 0,
        4, 4, 4,
        0, 0, 0,
        4, 4, 4,
        0, 0, 0
    ];
    const sparkScaleTrack = new THREE.VectorKeyframeTrack(`Spark.scale`, times, sparkScales);

    // Sparks color changing to simulate energy
    const sparkColors = [
        0, 0, 0,
        0, 1, 1, // Cyan electrical spark
        0, 0, 0,
        0, 1, 1,
        0, 0, 0
    ];
    const sparkColorTrack = new THREE.ColorKeyframeTrack(`SparkMaterial.color`, times, sparkColors);
    
    const clip = new THREE.AnimationClip('GeneratePower', 2, [
        topTrack, sparkScaleTrack, sparkColorTrack
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
