import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import AnaliseIACard from './AnaliseIACard';
import getDataHoraEntrada from '../utils/getDataHoraEntrada';

export default function EntradaDiarioCard({ entrada, defaultAberto = false }) {
    const iconeEscrita = require('../assets/images/pen-tool.png');
    const [abertoFechado, setAbertoFechado] = useState(defaultAberto);
    const { horaEntrada, dataEntrada } = getDataHoraEntrada(entrada);
    
    return (
        <View style={styles.timelineItem}>
            <View style={styles.entradaCard}>
                <View style={styles.cardTop}>
                    <View style={{flexDirection:"row", gap:6, alignItems:"center"}}>
                    <Image style={{width:14, height:14}} source={iconeEscrita}/>
                    <Text style={styles.cardTopTexto}>{`${dataEntrada}, ${horaEntrada}`}</Text>
                    </View>
                    <Pressable style={styles.expandirRecolher} onPress={() => setAbertoFechado((v) => !v)}>
                        <Text style={styles.expandirRecolherTexto}>
                            {abertoFechado ? '▲ recolher' : '▼ expandir'}
                        </Text>
                    </Pressable>
                </View>
                <Text style={styles.textoEntrada}>
                    {abertoFechado ? entrada.texto : ((entrada.texto ?? '').slice(0, 200) + '...')}
                </Text>
                {abertoFechado && <AnaliseIACard respostaIA={entrada} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    entradaCard: {
        width: '100%',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#e4daf5',
        elevation: 3,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTopTexto: {
        fontSize: 13,
        fontWeight: '700',
        color: '#7059b0',
    },
    expandirRecolher: {
        backgroundColor: '#ece6f8',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    expandirRecolherTexto: {
        fontSize: 13,
        fontWeight: '700',
        color: '#9e8cc5',
    },
    textoEntrada: {
        marginBottom: 16,
    },
    timelineItem: {
        position: 'relative',
        marginBottom: 24,
    },
    timelineCirculo: {
        position: 'absolute',
        left: -28,
        top: 16,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#7962B9',
        borderWidth: 3,
        borderColor: '#7962B9',
    },
});