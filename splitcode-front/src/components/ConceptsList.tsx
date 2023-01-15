import * as React from 'react';
import {
    Button,
    Card,
    CardHeader,
    Checkbox,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";

function ConceptsList(props: { getConcepts: (concepts: string[]) => void }) {

    const [checked, setChecked] = React.useState<string[]>([]);
    const [left, setLeft] = React.useState<string[]>(["var", "val", "if", "else", "else if", "for", "while", "do", "break", "class", "def", "import", "package"]);
    const [right, setRight] = React.useState<string[]>([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
        props.getConcepts(right.concat(left))
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        props.getConcepts(right.concat(leftChecked))

    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
        props.getConcepts(not(right, rightChecked))

    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
        props.getConcepts([])
    };

    const customList = (items: readonly string[], title: string) => (
        <Card elevation={4}>
            <CardHeader title={title}/>
            <Divider/>
            <List sx={{width: 300, height: 230, overflow: 'auto'}} dense component="div" role="list">
                {items.map((value: string, index: number) => {
                    const labelId = `transfer-list-item-${index}-label`;
                    return (
                        <ListItem
                            key={index}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value}/>
                        </ListItem>
                    );
                })}
                <ListItem/>
            </List>
        </Card>
    );
    return (
        <Grid container sx={{marginTop: 2}} spacing={2} justifyContent="center" alignItems="center">
            <Grid item>{customList(left, "All concepts")}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{my: 0.5}}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{my: 0.5}}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{my: 0.5}}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{my: 0.5}}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList(right, "Chosen concepts")}</Grid>
        </Grid>
    );
}

function not(a: readonly string[], b: readonly string[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default ConceptsList;
