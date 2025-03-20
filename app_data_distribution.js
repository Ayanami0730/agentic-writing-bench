
        // 甜甜圈图数据
        const donutData = [{"topic": "Science & Technology", "value": 26, "percentage": 19.8, "color": "#636EFA", "description": "Includes physics, chemistry, biology, environmental science, mathematics, statistics, biotech, and engineering."}, {"topic": "Finance & Business", "value": 25, "percentage": 19.1, "color": "#EF553B", "description": "Includes taxes, regulations, investments, insurance, credit cards, personal finance, corporate communication, marketing, and human resources."}, {"topic": "Industrial", "value": 13, "percentage": 9.9, "color": "#00CC96", "description": "Topics related to mining, agriculture, manufacturing, utilities and construction. Includes raw materials, industrial goods, chemicals, and textiles."}, {"topic": "Software Development", "value": 12, "percentage": 9.2, "color": "#AB63FA", "description": "Includes algorithms, coding, and web development."}, {"topic": "Software", "value": 11, "percentage": 8.4, "color": "#FFA15A", "description": "Topics related to the use of software and the internet."}, {"topic": "Education & Jobs", "value": 11, "percentage": 8.4, "color": "#19D3F3", "description": "Includes pedagogy, training & certification, academia, career development, and job searching."}, {"topic": "None", "value": 5, "percentage": 3.8, "color": "#FF6692", "description": "\u65e0\u63cf\u8ff0"}, {"topic": "Health", "value": 5, "percentage": 3.8, "color": "#B6E880", "description": "Includes medicine, wellness, mental health, veterinary science, and nutritional science. Health insurance falls under 'Finance & Business'."}, {"topic": "Transportation", "value": 4, "percentage": 3.1, "color": "#FF97FF", "description": "Includes cars and other vehicles, taxis, public transportation, traffic, commuting, aviation, rail, shipping, and logistics."}, {"topic": "Art & Design", "value": 4, "percentage": 3.1, "color": "#FECB52", "description": "Includes architecture, visual arts, and design principles."}, {"topic": "Hardware", "value": 3, "percentage": 2.3, "color": "#1F77B4", "description": "Includes computer hardware, phones, televisions, and other consumer electronics."}, {"topic": "Entertainment", "value": 3, "percentage": 2.3, "color": "#FF7F0E", "description": "Includes music, movies, TV shows, videos, celebrities, humor, and nightlife. Music or film discussed as art falls under 'Art & Design'."}, {"topic": "Literature", "value": 2, "percentage": 1.5, "color": "#2CA02C", "description": "Includes literary criticism, linguistics, philosophy, and related subjects in the humanities."}, {"topic": "Religion", "value": 1, "percentage": 0.8, "color": "#D62728", "description": "Includes spirituality and religious practices."}, {"topic": "Travel", "value": 1, "percentage": 0.8, "color": "#9467BD", "description": "Includes hospitality, hotels, sight-seeing, and cruises. Detailed descriptions of tourist destinations fall under 'History'."}, {"topic": "\u5176\u4ed6", "value": 5, "percentage": 4.0, "color": "#8C564B", "description": "\u5176\u4ed6\u7c7b\u522b\u4e3b\u9898"}];
        
        // 甜甜圈图配置
        const donutConfig = {
            container: 'donut-chart',
            outerRadius: 180,
            innerRadius: 90,
            showLabels: true,
            showValues: true,
            animationDuration: 800,
            hoverEffect: true
        };
        
        // 创建甜甜圈图
        document.addEventListener('DOMContentLoaded', function() {
            createDonutChart(donutData, donutConfig);
            
            // 表格行悬停效果
            var rows = document.querySelectorAll('tbody tr');
            rows.forEach(function(row, index) {
                row.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = 'rgba(74, 109, 211, 0.05)';
                    highlightDonutSlice(index);
                });
                row.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = '';
                    resetDonutHighlight();
                });
            });
        });
        
        // 绘制甜甜圈图函数
        function createDonutChart(data, config) {
            const container = document.getElementById(config.container);
            if (!container) return;
            
            // 创建SVG元素
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '400px');
            svg.setAttribute('viewBox', `-200 -200 400 400`);
            container.appendChild(svg);
            
            // 计算总和
            const total = data.reduce((sum, d) => sum + d.value, 0);
            
            // 创建图例和标签
            const legend = document.createElement('div');
            legend.className = 'donut-legend';
            container.parentNode.insertBefore(legend, container.nextSibling);
            
            // 绘制甜甜圈片段
            let startAngle = 0;
            data.forEach((item, i) => {
                const percentage = item.value / total;
                const angle = percentage * 2 * Math.PI;
                const endAngle = startAngle + angle;
                
                // 计算路径
                const x1 = Math.sin(startAngle) * config.outerRadius;
                const y1 = -Math.cos(startAngle) * config.outerRadius;
                const x2 = Math.sin(endAngle) * config.outerRadius;
                const y2 = -Math.cos(endAngle) * config.outerRadius;
                
                // 创建路径
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const largeArcFlag = angle > Math.PI ? 1 : 0;
                
                const d = [
                    `M ${x1} ${y1}`,
                    `A ${config.outerRadius} ${config.outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    `L ${Math.sin(endAngle) * config.innerRadius} ${-Math.cos(endAngle) * config.innerRadius}`,
                    `A ${config.innerRadius} ${config.innerRadius} 0 ${largeArcFlag} 0 ${Math.sin(startAngle) * config.innerRadius} ${-Math.cos(startAngle) * config.innerRadius}`,
                    'Z'
                ].join(' ');
                
                path.setAttribute('d', d);
                path.setAttribute('fill', item.color);
                path.setAttribute('stroke', 'white');
                path.setAttribute('stroke-width', '1');
                path.setAttribute('data-index', i);
                path.classList.add('donut-slice');
                
                // 添加交互
                path.addEventListener('mouseenter', () => highlightDonutSlice(i));
                path.addEventListener('mouseleave', () => resetDonutHighlight());
                
                svg.appendChild(path);
                
                // 添加图例项
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                legendItem.innerHTML = `
                    <span class="legend-color" style="background-color: ${item.color}"></span>
                    <span class="legend-text">${item.topic}: ${item.percentage}%</span>
                `;
                legendItem.addEventListener('mouseenter', () => highlightDonutSlice(i));
                legendItem.addEventListener('mouseleave', () => resetDonutHighlight());
                legend.appendChild(legendItem);
                
                // 添加标签
                if (config.showLabels && percentage > 0.03) {
                    const labelAngle = startAngle + angle / 2;
                    const labelRadius = (config.outerRadius + config.innerRadius) / 2;
                    const labelX = Math.sin(labelAngle) * labelRadius;
                    const labelY = -Math.cos(labelAngle) * labelRadius;
                    
                    const textAnchor = labelX > 0 ? 'start' : 'end';
                    const labelOffset = 5 * (labelX > 0 ? 1 : -1);
                    
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', labelX + labelOffset);
                    text.setAttribute('y', labelY);
                    text.setAttribute('text-anchor', textAnchor);
                    text.setAttribute('font-size', '12');
                    text.setAttribute('fill', '#333');
                    text.setAttribute('data-index', i);
                    text.classList.add('donut-label');
                    text.textContent = `${item.percentage}%`;
                    svg.appendChild(text);
                }
                
                startAngle = endAngle;
            });
            
            // 创建中心圆
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', 0);
            circle.setAttribute('cy', 0);
            circle.setAttribute('r', config.innerRadius);
            circle.setAttribute('fill', 'white');
            svg.appendChild(circle);
            
            // 添加中心文字
            const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            centerText.setAttribute('x', 0);
            centerText.setAttribute('y', 0);
            centerText.setAttribute('text-anchor', 'middle');
            centerText.setAttribute('dominant-baseline', 'middle');
            centerText.setAttribute('font-size', '16');
            centerText.setAttribute('font-weight', 'bold');
            centerText.setAttribute('fill', '#333');
            centerText.textContent = `共${total}条`;
            svg.appendChild(centerText);
            
            // 添加中心副标题
            const subText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            subText.setAttribute('x', 0);
            subText.setAttribute('y', 25);
            subText.setAttribute('text-anchor', 'middle');
            subText.setAttribute('dominant-baseline', 'middle');
            subText.setAttribute('font-size', '12');
            subText.setAttribute('fill', '#666');
            subText.textContent = '用户需求';
            svg.appendChild(subText);
        }
        
        // 高亮甜甜圈片段
        function highlightDonutSlice(index) {
            const slices = document.querySelectorAll('.donut-slice');
            const labels = document.querySelectorAll('.donut-label');
            const legendItems = document.querySelectorAll('.legend-item');
            
            slices.forEach((slice, i) => {
                if (i === index) {
                    slice.setAttribute('stroke-width', '3');
                    slice.style.transform = 'scale(1.05)';
                    slice.style.transformOrigin = 'center';
                    slice.style.transition = 'transform 0.2s ease';
                } else {
                    slice.style.opacity = '0.5';
                }
            });
            
            labels.forEach((label, i) => {
                if (i === index) {
                    label.setAttribute('font-weight', 'bold');
                } else {
                    label.style.opacity = '0.5';
                }
            });
            
            legendItems.forEach((item, i) => {
                if (i === index) {
                    item.style.fontWeight = 'bold';
                    item.style.backgroundColor = 'rgba(74, 109, 211, 0.1)';
                } else {
                    item.style.opacity = '0.5';
                }
            });
        }
        
        // 重置甜甜圈高亮
        function resetDonutHighlight() {
            const slices = document.querySelectorAll('.donut-slice');
            const labels = document.querySelectorAll('.donut-label');
            const legendItems = document.querySelectorAll('.legend-item');
            
            slices.forEach(slice => {
                slice.setAttribute('stroke-width', '1');
                slice.style.opacity = '1';
                slice.style.transform = 'scale(1)';
            });
            
            labels.forEach(label => {
                label.setAttribute('font-weight', 'normal');
                label.style.opacity = '1';
            });
            
            legendItems.forEach(item => {
                item.style.fontWeight = 'normal';
                item.style.opacity = '1';
                item.style.backgroundColor = 'transparent';
            });
        }
        