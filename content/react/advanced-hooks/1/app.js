import { useEffect, useState } from "react"
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi"
import useSafeAsync from "./components/use-async"
import delayedFetchRickAndMortyCharacterById from "./components/fetch-rick-and-morty"
import PositiveIntegerSearchbar from "./components/positive-integer-search-bar"
import { ErrorView, PendingView, IdleView } from "./components/views"
import InfoView from "./components/info-view"
import { DefaultButton } from "components/button"
import { BorderedDiv } from "components/pretty-defaults"
/*
This`RickAndMortyInfoCard` uses a `useSafeAsync` hook that's responsible for managing the state,
and fetching the data.

The hook makes sure that the dispatch function (that returns the the data and state from
the fetch function) would not be run if the component is no longer mounted.

In other words, if the `RickAndMortyInfoCard` is no longer mounted,
its state will no longer be updated (since it doesn't exist anymore)

The `runFunction` provided by `useSafeAsync` is the function that we should run whenever we want
to fetch the data. The `runFunction` takes in a promise and updates the state `{data, status error}`.

In our case, the promise that we feed to the `runFunction` is the return value of the `fetchFunction`
we call whenever we need to fetch something.
 */
function RickAndMortyInfoCard({ characterId, getStatus }) {
    const { data, status, error, runFunction } = useSafeAsync({
        status: characterId ? "pending" : "idle",
    })

    useEffect(() => {
        getStatus(status)
    }, [status, getStatus])

    useEffect(() => {
        if (!characterId) {
            return
        }
        runFunction(delayedFetchRickAndMortyCharacterById(characterId))
    }, [characterId, runFunction])

    if (status === "idle") {
        return <IdleView />
    } else if (status === "pending") {
        return <PendingView />
    } else if (status === "rejected") {
        return <ErrorView message={error.message} />
    } else if (status === "resolved") {
        return <InfoView data={data} />
    }

    throw new Error("This should be impossible")
}

const NUMBER_OF_RICK_AND_MORTY_CHARACTERS = 672
const randomIntegerBetween = (x, y) => Math.floor(Math.random() * y) + x
const getRandomRickAndMortyCharacterId = () =>
    randomIntegerBetween(1, NUMBER_OF_RICK_AND_MORTY_CHARACTERS)

function App() {
    const [state, setState] = useState({
        submittedValue: "",
        incompleteValue: "",
    })

    const [fetchStatus, setFetchStatus] = useState("idle")

    const { incompleteValue, submittedValue } = state

    const setIncompleteValue = value => setState({ ...state, incompleteValue: value })
    const setSubmittedValue = value => setState({ ...state, submittedValue: value })

    const setRandomValue = () => {
        const id = getRandomRickAndMortyCharacterId()
        setState({ submittedValue: id, incompleteValue: id })
    }

    const randomButtonDisabled = fetchStatus === "pending"
    // the submit button is disabled when
    // 1. We are process of fetching data
    // 2. the input field value has already been resolved or rejected
    // 3. There is no value in the input field
    const submitButtonDisabled =
        randomButtonDisabled ||
        !incompleteValue ||
        (incompleteValue === submittedValue &&
            ["resolved", "rejected"].includes(fetchStatus))

    return (
        <div style={{ margin: "20px" }}>
            <p style={{ fontSize: "12px" }}>
                Only positive integers from 1 to 671 correspond to a Rick and Morty
                character.
            </p>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <PositiveIntegerSearchbar
                    value={submittedValue}
                    onSubmit={value => setSubmittedValue(value)}
                    {...{ incompleteValue, setIncompleteValue }}
                    placeholder={"Pick a number!"}
                    disabled={submitButtonDisabled}
                />
                <DefaultButton
                    onClick={setRandomValue}
                    style={{ height: "35px", width: "35px" }}
                    disabled={randomButtonDisabled}
                >
                    <GiPerspectiveDiceSixFacesRandom />
                </DefaultButton>
            </div>

            <RickAndMortyInfoCard
                characterId={submittedValue}
                {...{ getStatus: setFetchStatus }}
            />
        </div>
    )
}

function AppWithUnmountCheckbox() {
    const [mountApp, setMountApp] = useState(true)

    return (
        <div>
            <BorderedDiv
                style={{
                    margin: "10px",
                    padding: "10px",
                    borderWidth: "1px",
                    borderStyle: "dashed",
                    width: "auto",
                }}
            >
                <label>
                    <input
                        type="checkbox"
                        checked={mountApp}
                        onChange={e => setMountApp(e.target.checked)}
                    />
                    <span style={{ fontSize: "15px" }}> Mount the search bar</span>
                </label>
            </BorderedDiv>
            {mountApp ? <App /> : null}
        </div>
    )
}

export default AppWithUnmountCheckbox
