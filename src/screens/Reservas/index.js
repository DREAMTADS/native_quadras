import DateTimePicker  from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import quadrasApi from '../../services/quadrasApi.js';

export default function Reservas() {
    const [quadras, setQuadras] = useState([]); 
    const [selectedQuadra, setSelectedQuadra] = useState();
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');
    const [response, setResponse] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [displayPicker, setDisplayPicker] = useState(false);

    const onChange = (event, value) => {
        setStartDate(value);
        if (Platform.OS === 'android') {
            setDisplayPicker(false);
        }
      };

    useEffect(() => {
        const listarQuadras = async() => {
            try{       
                const res = await quadrasApi.get('/quadras');
    
                if(res.status === 200){
                    setQuadras(res.data);
                    setNome('');
                    setTipo('');
                }
    
            } catch {(err) => {console.log(err)}}
        }

        const startScreenInfo = async() => {
            await listarQuadras();
        }

        startScreenInfo();
    }, []);

    return (
        <View>
            <AutocompleteDropdown
                clearOnFocus={false}
                closeOnBlur={true}
                closeOnSubmit={false}
                onSelectItem={item => item && console.log(item.quadra)}
                dataSet={
                    quadras.map((item, index ) => {
                        return {
                            id: index, 
                            title: item.nome,
                            quadra: item._id
                        }
                    }
                )}
            />

            <TextInput
                label="Nome Completo"
                value={nome}
                onChangeText={text => setNome(text)}
            />

            <TextInput
                label="CPF"
                value={tipo}
                onChangeText={text => setTipo(text)}
            />
            <Text>
                {startDate.toLocaleTimeString()}
            </Text>
            {displayPicker &&
                <DateTimePicker  
                    value={startDate}
                    mode="time" 
                    display='default'
                    minuteInterval={30}
                    onChange={onChange}
                    minimumDate={Date.parse(new Date())}
                />
            }

            <Button mode="contained" onPress={() => setDisplayPicker(true)}>
                Selecionar horario
            </Button>

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