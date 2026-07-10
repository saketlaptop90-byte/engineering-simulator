export const chem_c_nanoscroll = {
    id: 'chem_c_nanoscroll',
    name: 'Carbon - Nanoscroll',
    type: 'chemistry',
    category: 'Chemistry',
    price: 72000,
    description: 'Carbon Nanoscroll (CNS). A continuous graphene sheet rolled up into a spiraling Archimedean scroll shape.',
    particles: '300 carbon atoms in an open topological spiral',
    connections: 'Intra-layer sp2 bonds and inter-layer Van der Waals forces',
    isPremium: true,
    
    init: function(engine) {
        this.engine = engine;
        this.particles = [];
        this.constraints = [];
        this.createStructure();
    },

    createStructure: function() {
        const count = parseInt(this.particles.match(/\d+/)[0]) || 200;
        const cx = 400, cy = 300;
        
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            
            // Generate distinct 3D volumetric distributions
            let r = 80;
            if (this.id === 'chem_c_schwarzite') {
                r = 90 * (1 + 0.4 * Math.sin(theta * 3) * Math.cos(phi * 3));
            } else if (this.id === 'chem_c_nanoscroll') {
                r = 20 + i * 0.25;
            } else {
                r = 80 * (1 + 0.2 * Math.sin(theta * 5));
            }
            
            const x = r * Math.sin(phi) * Math.cos(theta) + cx;
            const y = r * Math.sin(phi) * Math.sin(theta) + cy;
            
            let isHydrogen = (this.id === 'chem_c_graphane' && i > count / 2);
            
            const particle = this.engine.addParticle(x, y, {
                mass: isHydrogen ? 1.008 : 12.011,
                radius: isHydrogen ? 4 : 6,
                restitution: 0.85,
                friction: 0.05,
                color: isHydrogen ? '#ffffff' : '#3b3b3b',
                label: isHydrogen ? 'H' : 'C',
                element: isHydrogen ? 'Hydrogen' : 'Carbon'
            });
            
            particle.vx = (Math.random() - 0.5) * 0.3;
            particle.vy = (Math.random() - 0.5) * 0.3;
            
            this.particles.push(particle);
        }
        
        const connectThreshold = 40;
        
        for (let i = 0; i < this.particles.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < connectThreshold && connections < 4) {
                    const bond = this.engine.addConstraint(p1, p2, {
                        stiffness: 0.8,
                        damping: 0.05,
                        length: dist,
                        color: 'rgba(0, 255, 255, 0.3)',
                        width: 1.5
                    });
                    this.constraints.push(bond);
                    connections++;
                }
            }
        }
    },
    
    update: function(dt) {
        const time = Date.now() * 0.001;
        const cx = 400, cy = 300;
        
        this.particles.forEach((p, i) => {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > 30) {
                p.vx -= (dx / dist) * 0.06 * (1 + 0.1 * Math.sin(time * 2 + i));
                p.vy -= (dy / dist) * 0.06 * (1 + 0.1 * Math.cos(time * 2 + i));
            }
            
            p.vx += Math.sin(time * 4 + i * 0.2) * 0.1;
            p.vy += Math.cos(time * 4 + i * 0.2) * 0.1;
            
            if (this.id.includes('nanoscroll') || this.id.includes('nanobud')) {
                p.vx += (dy / dist) * 0.25;
                p.vy -= (dx / dist) * 0.25;
            }
        });
    },

    draw: function(ctx) {
        ctx.beginPath();
        this.constraints.forEach(c => {
            ctx.moveTo(c.p1.x, c.p1.y);
            ctx.lineTo(c.p2.x, c.p2.y);
        });
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        this.particles.forEach(p => {
            const isHydrogen = p.label === 'H';
            const baseColor = isHydrogen ? '#dddddd' : '#00ffff';
            
            const gradient = ctx.createRadialGradient(p.x - p.radius*0.2, p.y - p.radius*0.2, 0, p.x, p.y, p.radius * 2);
            gradient.addColorStop(0, isHydrogen ? '#ffffff' : '#ffffff');
            gradient.addColorStop(0.3, isHydrogen ? '#aaaaaa' : '#444444');
            gradient.addColorStop(1, '#000000');
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = isHydrogen ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 255, 255, 0.05)';
            ctx.fill();
            
            ctx.fillStyle = baseColor;
            ctx.font = '7px Space Grotesk, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, p.x, p.y);
        });
    }
};
