import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import quadrasApi from '../../services/quadrasApi.js';

export default function Quadras() {
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');
    const [coberta, setCoberta] = useState(false);
    const [bancos, setBancos] = useState(false);
    const [arquibancada, setArquibancada] = useState(false);
    const [bloqueada, setBloqueada] = useState(false);
    const [response, setResponse] = useState('');

    const cadastrarQuadra = async() => {
        try{
            const data = {
                nome,
                tipo,
                coberta,
                bancos,
                arquibancada,
                bloqueada
            }
            
            const res = await quadrasApi.post('/quadras', data);

            if(res.status === 201){
                setResponse('Criou a quadra');
                setArquibancada(false);
                setBancos(false);
                setBloqueada(false);
                setCoberta(false);
                setNome('');
                setTipo('');
            }

        } catch {(err) => {console.log(err)}}
    }

    return (
        <View>
            <TextInput
                label="Nome da quadra"
                value={nome}
                onChangeText={text => setNome(text)}
            />

            <TextInput
                label="Tipo da quadra"
                value={tipo}
                onChangeText={text => setTipo(text)}
            />

            <View style={styles.flexView}>
                <Text>Quadra coberta: </Text>
                <Checkbox 
                    status={coberta ? 'checked' : 'uncheked'} 
                    onPress={() => {setCoberta(!coberta)}}
                />
            </View>

            <View style={styles.flexView}>
                <Text>Possui Bancos: </Text>
                <Checkbox 
                    status={bancos ? 'checked' : 'uncheked'} 
                    onPress={() => {setBancos(!bancos)}}
                />
            </View>

            <View style={styles.flexView}>
                <Text>Possui arquibancada: </Text>
                <Checkbox 
                    status={arquibancada ? 'checked' : 'uncheked'} 
                    onPress={() => {setArquibancada(!arquibancada)}}
                />
            </View>

            <View style={styles.flexView}>
                <Text>Bloqueada: </Text>
                <Checkbox 
                    status={bloqueada ? 'checked' : 'uncheked'} 
                    onPress={() => {setBloqueada(!bloqueada)}}
                />
            </View>

            <Button mode="contained" onPress={() => cadastrarQuadra()}>
                Cadastrar Quadra
            </Button>

            <Text>
                {response}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    flexView: {
        flexDirection: 'row'
    }
})