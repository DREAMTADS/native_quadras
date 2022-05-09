import DateTimePicker  from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import quadrasApi from '../../services/quadrasApi.js';

export default function Horarios() {
    const [quadras, setQuadras] = useState([]); 
    const [selectedQuadra, setSelectedQuadra] = useState('');
    const [horarios, setHorarios] = useState();

    const listarHoraios = async() => {
        try{       

            const res = await quadrasApi.get(`/reservas/horarios/${selectedQuadra}`);
            console.log(res.data);
            if(res.status === 200){
                setHorarios(res.data);
            }

        } catch {(err) => {console.log(err)}}
    }


    useEffect(() => {
        const listarQuadras = async() => {
            try{       
                const res = await quadrasApi.get('/quadras');
    
                if(res.status === 200){
                    setQuadras(res.data);
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
                onSelectItem={item => item && setSelectedQuadra(item.quadra)}
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

            {horarios ? 
                    <FlatList
                        data={horarios}
                        removeClippedSubviews={false}
                        renderItem={({item}) => 
                            <Text>{item.nomeCliente}</Text>
                        }
                        keyExtractor={({_id}) => String(_id)}
                    />
                :
                    <Text>Sem horario selecionado</Text>
            }

            <Button mode="contained" onPress={() => listarHoraios()}>
                Buscar Horarios
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    flexView: {
        flexDirection: 'row'
    }
})